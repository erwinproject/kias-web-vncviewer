const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const ping = require('ping');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const SECRET_KEY = 'KAS_SECRET_KEY_2024'; 

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'vnc_management'
});

db.connect(err => {
    if (err) {
        console.error('Gagal terhubung ke MySQL:', err.message);
        return;
    }
    console.log('Terhubung ke Database MySQL!');
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Akses ditolak' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Sesi kadaluwarsa' });
        req.user = user;
        next();
    });
};

// --- AUTH ENDPOINTS ---

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Default is_active = 0 (Menunggu persetujuan admin)
        const query = 'INSERT INTO users (username, password, is_active) VALUES (?, ?, 0)';
        db.query(query, [username, hashedPassword], (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username sudah digunakan' });
                return res.status(500).json(err);
            }
            res.json({ message: 'Registrasi berhasil. Silakan hubungi Admin untuk aktivasi akun.' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(401).json({ message: 'User tidak ditemukan' });

        const user = results[0];

        // CEK STATUS AKTIF
        if (user.is_active !== 1) {
            return res.status(403).json({ message: 'Akun Anda belum aktif. Hubungi Admin.' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Password salah' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    });
});

// --- PROTECTED ENDPOINTS ---

app.get('/api/servers', authenticateToken, (req, res) => {
    db.query('SELECT * FROM servers', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post('/api/servers', authenticateToken, (req, res) => {
    const { name, host, proxy_port, password } = req.body;
    db.query('INSERT INTO servers (name, host, proxy_port, password) VALUES (?, ?, ?, ?)', [name, host, proxy_port, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

app.delete('/api/servers/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM servers WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Deleted' });
    });
});

app.get('/api/servers/status', authenticateToken, async (req, res) => {
    db.query('SELECT id, host FROM servers', async (err, results) => {
        if (err) return res.status(500).json(err);
        const statusResults = await Promise.all(results.map(async (s) => {
            try {
                const resPing = await ping.promise.probe(s.host, { timeout: 2 });
                return { id: s.id, status: resPing.alive ? 'online' : 'offline' };
            } catch (e) { return { id: s.id, status: 'offline' }; }
        }));
        res.json(statusResults);
    });
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));