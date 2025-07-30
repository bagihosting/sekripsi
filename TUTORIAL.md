# Panduan Deployment Aplikasi Next.js di Ubuntu 22.04 dengan Nginx

Dokumen ini memberikan panduan langkah demi langkah untuk men-deploy aplikasi Next.js ini di server Ubuntu 22.04, menjalankannya menggunakan PM2, dan menyajikannya melalui subdomain menggunakan Nginx sebagai reverse proxy.

## 1. Persiapan Server

Pastikan server Anda sudah siap dan Anda memiliki akses `sudo`.

```bash
# Perbarui daftar paket dan upgrade sistem
sudo apt update && sudo apt upgrade -y

# Instal paket build-essential yang diperlukan untuk kompilasi
sudo apt install -y build-essential
```

## 2. Instalasi Node.js menggunakan NVM

Menggunakan Node Version Manager (NVM) adalah cara terbaik untuk mengelola versi Node.js.

```bash
# Unduh dan jalankan skrip instalasi NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Muat NVM agar dapat digunakan di sesi terminal saat ini dan untuk masa mendatang
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Instal Node.js versi LTS (Long-Term Support) terbaru
nvm install --lts

# Verifikasi instalasi
node -v
npm -v
```

## 3. Setup Aplikasi

Kloning repositori proyek Anda dan instal dependensinya.

```bash
# Kloning repositori dari GitHub (ganti dengan URL repo Anda)
git clone https://github.com/username/repository.git
cd repository

# Instal dependensi proyek
npm install
```

### Konfigurasi Environment Variables

Buat file `.env` untuk menyimpan semua kredensial dan kunci API.

```bash
# Buat file .env baru dari awal
nano .env
```

Isi file `.env` dengan semua nilai yang diperlukan.

#### A. Kredensial Klien (NEXT_PUBLIC_)

Nilai-nilai ini aman untuk diekspos ke browser dan digunakan oleh Firebase Client SDK.

1.  Buka [Firebase Console](https://console.firebase.google.com/).
2.  Pilih proyek Anda.
3.  Klik ikon gerigi (⚙️) di pojok kiri atas, lalu pilih **Project settings**.
4.  Di tab **General**, scroll ke bawah ke bagian **Your apps**.
5.  Pilih aplikasi web Anda.
6.  Pilih **Config** untuk melihat objek konfigurasi `firebaseConfig`.
7.  Salin nilai-nilai ini ke dalam file `.env` Anda.

#### B. Kredensial Firebase Admin SDK (Server-side) - SANGAT RAHASIA

Nilai ini **sangat rahasia** dan hanya boleh ada di server Anda. Kunci ini memberikan akses penuh ke backend Firebase Anda.

1.  Di **Project settings**, buka tab **Service accounts**.
2.  Klik tombol **Generate new private key**. Sebuah file JSON akan terunduh ke komputer Anda.
3.  Buka file JSON tersebut dengan editor teks.
4.  **Salin seluruh konten file JSON tersebut**, mulai dari `{` hingga `}`.
5.  Tempelkan konten tersebut sebagai nilai untuk `FIREBASE_SERVICE_ACCOUNT_KEY` di file `.env` Anda. **PENTING:** Pastikan seluruh konten JSON berada di dalam tanda kutip tunggal (`'...'`) agar dapat dibaca sebagai satu baris string oleh sistem.

#### Contoh Isi File `.env`

```
# Kredensial Firebase Client (Sisi Browser)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... (dan variabel NEXT_PUBLIC lainnya)

# Kredensial Firebase Admin (Sisi Server) - RAHASIA!
# Salin seluruh isi file JSON service account ke sini di dalam tanda kutip tunggal.
FIREBASE_SERVICE_ACCOUNT_KEY='{"type": "service_account", "project_id": "...", ...}'

# Kredensial Cloudinary (Opsional, jika menggunakan)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

## 4. Membangun dan Menjalankan Aplikasi dengan PM2

PM2 adalah *process manager* untuk aplikasi Node.js yang akan menjaga aplikasi tetap berjalan.

```bash
# Instal PM2 secara global
sudo npm install -g pm2

# Bangun aplikasi Next.js untuk produksi
npm run build

# Jalankan aplikasi menggunakan PM2 (ganti "nextjs-app" dengan nama pilihanmu)
pm2 start npm --name "nextjs-app" -- start

# Atur PM2 agar otomatis berjalan saat server startup
pm2 startup
# (Ikuti instruksi yang ditampilkan oleh perintah di atas untuk menjalankannya)

# Simpan konfigurasi PM2 saat ini
pm2 save
```

Aplikasi Anda sekarang berjalan, tetapi hanya dapat diakses melalui `localhost:3000`. Langkah selanjutnya adalah membuatnya dapat diakses dari luar.

## 5. Konfigurasi Nginx sebagai Reverse Proxy

Nginx akan bertindak sebagai "pintu gerbang" yang menerima permintaan dari internet dan meneruskannya ke aplikasi Anda.

```bash
# Instal Nginx
sudo apt install -y nginx

# Buat file konfigurasi baru untuk subdomain Anda
sudo nano /etc/nginx/sites-available/subdomain.yourdomain.com
```

Salin dan tempel konfigurasi berikut ke dalam file, ganti `subdomain.yourdomain.com` dengan subdomain Anda yang sebenarnya:

```nginx
server {
    listen 80;
    server_name subdomain.yourdomain.com;

    location / {
        # Port di mana aplikasi Next.js berjalan
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifkan konfigurasi ini dengan membuat *symbolic link*:

```bash
sudo ln -s /etc/nginx/sites-available/subdomain.yourdomain.com /etc/nginx/sites-enabled/

# Uji konfigurasi Nginx untuk memastikan tidak ada error
sudo nginx -t

# Jika tidak ada error, restart Nginx untuk menerapkan perubahan
sudo systemctl restart nginx
```

**Penting:** Pastikan Anda sudah mengarahkan DNS record (tipe A) untuk `subdomain.yourdomain.com` ke alamat IP server Anda.

## 6. Mengamankan dengan SSL/TLS (HTTPS)

Gunakan Certbot untuk mendapatkan sertifikat SSL gratis dari Let's Encrypt.

```bash
# Instal Certbot dan plugin Nginx-nya
sudo apt install -y certbot python3-certbot-nginx

# Dapatkan dan instal sertifikat SSL
sudo certbot --nginx -d subdomain.yourdomain.com
```

Certbot akan secara otomatis memodifikasi file konfigurasi Nginx Anda untuk mengaktifkan HTTPS. Ia juga akan mengatur pembaruan otomatis.

Aplikasi Anda kini sudah berhasil di-deploy, berjalan secara andal dengan PM2, dan dapat diakses dengan aman melalui `https://subdomain.yourdomain.com`.
