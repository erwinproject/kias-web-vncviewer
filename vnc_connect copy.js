const WebSocket = require('ws');
const net = require('net');

// Menjalankan WebSocket Server di port 6080
const wss = new WebSocket.Server({ port: 6080 });

wss.on('connection', (ws) => {
    console.log('Browser terhubung ke Proxy...');

    // Menghubungkan ke VNC asli di port 5900
    const vnc = new net.Socket();
    vnc.connect(5900, '192.168.47.42', () => {
        console.log('Terhubung ke VNC Server (192.168.47.42:5900)');
    });

    // Jembatan Data
    ws.on('message', (data) => vnc.write(data));
    vnc.on('data', (data) => ws.send(data, { binary: true }));

    // Tutup koneksi jika salah satu putus
    ws.on('close', () => {
        console.log('Browser memutus koneksi.');
        vnc.end();
    });
    vnc.on('close', () => {
        console.log('VNC Server memutus koneksi.');
        ws.close();
    });

    vnc.on('error', (err) => console.error('VNC Error:', err.message));
});

console.log('Proxy VNC berjalan di port 6080...');