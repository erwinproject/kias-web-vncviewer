# VNC Remote Dashboard

Dashboard React untuk monitoring dan remote HMI/PLC via noVNC dengan tampilan sidebar, daftar unit, dan area koneksi real-time.

## Fitur

- Daftar server HMI (tambah, pilih, hapus).
- Pencarian cepat unit dari sidebar.
- Embed noVNC melalui iframe (`/novnc/vnc.html`).
- Tombol reconnect dan fullscreen untuk sesi aktif.
- Dukungan tema terang/gelap.
- UI responsif untuk desktop dan mobile.

## Arsitektur Singkat

- Frontend: React (Create React App) di port `3000`.
- noVNC: asset statis berada di `public/novnc`.
- Proxy WebSocket ke VNC: Node.js (`server.js`) di port `6080`.
- VNC target default: `192.168.47.42:5900` (diatur di `server.js`).

Alur koneksi:

1. User memilih unit di dashboard.
2. Frontend membuka `iframe` noVNC dengan parameter koneksi.
3. noVNC terhubung ke WebSocket proxy (`ws://<host>:6080/websockify`).
4. Proxy meneruskan data ke VNC server TCP (`5900`).

## Prasyarat

- Node.js 18+ (disarankan LTS terbaru).
- npm 9+.
- Akses jaringan ke VNC server target.

## Instalasi

```bash
npm install
```

## Menjalankan Proyek

Jalankan 2 proses terpisah:

1. Jalankan React app:

```bash
npm start
```

2. Jalankan proxy VNC:

```bash
node server.js
```

Buka aplikasi di `http://localhost:3000`.

## Konfigurasi Koneksi

### 1) Target VNC di proxy

Ubah host/port VNC asli di `server.js`:

```js
vnc.connect(5900, '192.168.47.42', () => {
  console.log('Terhubung ke VNC Server (192.168.47.42:5900)');
});
```

### 2) Port WebSocket proxy

Default port proxy adalah `6080`:

```js
const wss = new WebSocket.Server({ port: 6080 });
```

Pastikan nilai `proxy_port` unit di frontend sama dengan port proxy aktif.

## Script NPM

- `npm start` - Menjalankan React development server.
- `npm run build` - Build production ke folder `build`.
- `npm test` - Menjalankan test dengan react-scripts.

## Struktur File Utama

- `src/App.js` - UI dashboard, daftar unit, dan iframe noVNC.
- `server.js` - WebSocket-to-TCP bridge untuk VNC.
- `public/novnc` - Distribusi noVNC.

## Catatan Keamanan

- Password VNC saat ini dikirim lewat query parameter iframe.
- Hindari menyimpan kredensial produksi langsung di kode.
- Disarankan menambahkan autentikasi aplikasi dan TLS/WSS untuk deployment.

## Build Production

```bash
npm run build
```

Hasil build ada di folder `build`.
