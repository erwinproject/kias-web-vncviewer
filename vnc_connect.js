const WebSocket = require('ws');
const net = require('net');
const url = require('url');

// Menjalankan WebSocket Server di port 6080
const wss = new WebSocket.Server({ port: 6080 });

wss.on('connection', (ws, req) => {
    // Mengambil parameter dari URL, misal: ws://localhost:6080/?target=192.168.47.42:5900
    const query = url.parse(req.url, true).query;
    const target = query.target; // Format diharapkan "IP:PORT"

    if (!target) {
        console.log('Koneksi ditolak: Tidak ada target IP.');
        ws.close();
        return;
    }

    const [targetIp, targetPort] = target.split(':');
    console.log(`Menerima permintaan proxy ke -> ${targetIp}:${targetPort || 5900}`);

    const vnc = new net.Socket();
    
    // Hubungkan ke VNC target secara dinamis
    vnc.connect(targetPort || 5900, targetIp, () => {
        console.log(`Berhasil terhubung ke VNC asli (${targetIp})`);
    });

    // Jembatan Data (Sama seperti sebelumnya)
    ws.on('message', (data) => vnc.write(data));
    vnc.on('data', (data) => ws.send(data, { binary: true }));

    // Penanganan pemutusan koneksi
    ws.on('close', () => {
        console.log(`Browser memutus koneksi dari ${targetIp}`);
        vnc.end();
    });
    vnc.on('close', () => {
        console.log(`VNC Server ${targetIp} memutus koneksi.`);
        ws.close();
    });

    vnc.on('error', (err) => {
        console.error(`VNC Error (${targetIp}):`, err.message);
        ws.close();
    });
});

console.log('Multi-IP Proxy VNC berjalan di port 6080...');