const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Koneksi MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Sesuaikan dengan user MySQL Anda
    password: '',     // Sesuaikan dengan password MySQL Anda
    database: 'vnc_management'
});

db.connect(err => {
    if (err) throw err;
    console.log('Terhubung ke Database MySQL!');
});

// Endpoint: Ambil semua server
app.get('/api/servers', (req, res) => {
    db.query('SELECT * FROM servers', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Endpoint: Tambah server baru
app.post('/api/servers', (req, res) => {
    const { name, host, proxy_port, password } = req.body;
    const query = 'INSERT INTO servers (name, host, proxy_port, password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, host, proxy_port, password], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

// Endpoint: Hapus server
app.delete('/api/servers/:id', (req, res) => {
    db.query('DELETE FROM servers WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(5000, () => console.log('API running on http://localhost:5000'));