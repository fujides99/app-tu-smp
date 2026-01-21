Sistem Tata Usaha SMP
Aplikasi berbasis web untuk membantu mengelola tata usaha di Sekolah Menengah Pertama (SMP). Aplikasi ini dibangun dengan arsitektur full-stack untuk memudahkan pencatatan data siswa, guru, surat menyurat, dan pengumuman secara digital dan terstruktur.

Node.js
Express.js
SQLite

📸 Tampilan Aplikasi
(Screenshot of the application dashboard)

Catatan: Ganti teks di atas dengan screenshot dari aplikasi Anda untuk memberikan gambaran visual.

✨ Fitur
🔐 Sistem Login & Logout: Akses aman ke dalam aplikasi.
📊 Dashboard Interaktif: Menampilkan ringkasan statistik penting (jumlah siswa, guru, surat bulan ini, dll.).
👨‍🎓 Manajemen Data Siswa: Tambah, lihat detail, edit, dan hapus data siswa.
👩‍🏫 Manajemen Data Guru & Staff: Kelola data profil guru dan staf tata usaha.
📝 Manajemen Surat Menyurat: Catat surat masuk dan surat keluar dengan detail lengkap.
📢 Manajemen Pengumuman: Buat, publikasikan, dan hapus pengumuman sekolah.
📤 Export Data ke CSV: Unduh data siswa dan guru dalam format CSV untuk keperluan laporan.
🔍 Fitur Pencarian: Cari data siswa dan guru dengan mudah.
📱 Desain Responsif: Aplikasi dapat diakses dengan nyaman di berbagai ukuran layar (desktop & tablet).
🔔 Notifikasi Modern: Umpan balik yang informatif untuk setiap aksi pengguna (Toast Notifications).
🛠️ Tech Stack
Aplikasi ini dibangun menggunakan teknologi modern dan populer:

Frontend: HTML5, CSS3, JavaScript (Vanilla), Font Awesome
Backend: Node.js, Express.js
Database: SQLite3
📁 Struktur Projek

website-tu-smp-fullstack/
├── assets/
│   ├── css/
│   │   └── style.css         # File styling utama
│   └── js/
│       └── script.js         # Logika frontend
├── server/
│   ├── database.sqlite       # File database (tidak diunggah ke Git)
│   ├── node_modules/         # Dependensi backend (tidak diunggah ke Git)
│   ├── package.json          # Konfigurasi dan dependensi Node.js
│   └── server.js             # Kode server backend
├── index.html                # Halaman utama aplikasi
├── .gitignore                # File untuk mengabaikan file/folder tertentu
└── README.md                 # File ini
🚀 Cara Instalasi & Menjalankan
Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal Anda.

Prasyarat
Pastikan Anda telah menginstal:

Node.js (versi 14 atau lebih baru)
Git (untuk kloning repositori)
Langkah 1: Kloning Repositori
bash

git clone https://github.com/username-anda/website-tata-usaha-smp.git
cd website-tata-usaha-smp
Langkah 2: Instalasi Dependensi Backend
Navigasikan terminal Anda ke folder server dan jalankan perintah npm install untuk mengunduh semua package yang diperlukan.

bash

cd server
npm install
Langkah 3: Menjalankan Server
Setelah dependensi terinstal, jalankan server backend dengan perintah:

bash

npm start
Server akan berjalan di http://localhost:3000. Biarkan terminal ini tetap terbuka.

Langkah 4: Mengakses Aplikasi
Buka browser web Anda (Chrome, Firefox, dll) dan akses alamat:

http://localhost:3000

📖 Cara Penggunaan
Login: Gunakan kredensial berikut untuk masuk:
Username: admin
Password: admin123
Navigasi: Gunakan menu di sidebar untuk berpindah antar modul (Dashboard, Data Siswa, dll.).
Mengelola Data: Setiap modul memiliki tombol untuk menambah data baru dan ikon untuk mengedit atau menghapus data yang sudah ada.
🤝 Berkontribusi
Terima kasih telah mempertimbangkan untuk berkontribusi pada projek ini! Anda dapat membantu dengan:

Melaporkan bug (masalah).
Mengusulkan fitur baru.
Mengirimkan pull request untuk perbaikan kode.
📄 Lisensi
Projek ini dilisensikan di bawah MIT License. Anda bebas untuk menggunakan, memodifikasi, dan mendistribusikannya.

👤 Author
Dibuat dengan ❤️ oleh [Nama Anda/Username GitHub Anda]



