# Sistem Tata Usaha SMP

Aplikasi berbasis web untuk membantu mengelola tata usaha di Sekolah Menengah Pertama (SMP). Aplikasi ini dibangun dengan arsitektur full-stack untuk memudahkan pencatatan data siswa, guru, surat menyurat, dan pengumuman secara digital dan terstruktur.

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

## ✨ Fitur

-   **🔐 Sistem Login & Logout**: Akses aman ke dalam aplikasi.
-   **📊 Dashboard Interaktif**: Menampilkan ringkasan statistik penting (jumlah siswa, guru, surat bulan ini, dll.).
-   **👨‍🎓 Manajemen Data Siswa**: Tambah, lihat detail, edit, dan hapus data siswa.
-   **👩‍🏫 Manajemen Data Guru & Staff**: Kelola data profil guru dan staf tata usaha.
-   **📝 Manajemen Surat Menyurat**: Catat surat masuk dan surat keluar dengan detail lengkap.
-   **📢 Manajemen Pengumuman**: Buat, publikasikan, dan hapus pengumuman sekolah.
-   **📤 Export Data ke CSV**: Unduh data siswa dan guru dalam format CSV untuk keperluan laporan.
-   **🔍 Fitur Pencarian**: Cari data siswa dan guru dengan mudah.
-   **📱 Desain Responsif**: Aplikasi dapat diakses dengan nyaman di berbagai ukuran layar (desktop & tablet).
-   **🔔 Notifikasi Modern**: Umpan balik yang informatif untuk setiap aksi pengguna (Toast Notifications).

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi modern dan populer:

-   **Frontend**: HTML5, CSS3, JavaScript (Vanilla), Font Awesome
-   **Backend**: Node.js, Express.js
-   **Database**: SQLite3

## 🚀 Cara Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal:
-   [Node.js](https://nodejs.org/) (versi 14 atau lebih baru)
-   [Git](https://git-scm.com/) (untuk kloning repositori)

### Langkah 1: Kloning Repositori

```bash
git clone https://github.com/username-anda/website-tata-usaha-smp.git
cd website-tata-usaha-smp
```

### Langkah 2: Instalasi Dependensi Backend

Navigasikan terminal Anda ke folder `server` dan jalankan perintah `npm install` untuk mengunduh semua package yang diperlukan.

```bash
cd server
npm install
```

### Langkah 3: Menjalankan Server

Setelah dependensi terinstal, jalankan server backend dengan perintah:

```bash
npm start
```

Server akan berjalan di `http://localhost:3000`. **Biarkan terminal ini tetap terbuka.**

### Langkah 4: Mengakses Aplikasi

Buka browser web Anda (Chrome, Firefox, dll) dan akses alamat:

**`http://localhost:3000`**

## 📖 Cara Penggunaan

1.  **Login**: Gunakan kredensial berikut untuk masuk:
    -   **Username**: `admin`
    -   **Password**: `admin123`

2.  **Navigasi**: Gunakan menu di sidebar untuk berpindah antar modul (Dashboard, Data Siswa, dll.).

3.  **Mengelola Data**: Setiap modul memiliki tombol untuk menambah data baru dan ikon untuk mengedit atau menghapus data yang sudah ada.

## 🤝 Berkontribusi

Terima kasih telah mempertimbangkan untuk berkontribusi pada projek ini! Anda dapat membantu dengan:
-   Melaporkan bug (masalah).
-   Mengusulkan fitur baru.
-   Mengirimkan pull request untuk perbaikan kode.

## 📄 Lisensi

Projek ini dilisensikan di bawah **MIT License**. Anda bebas untuk menggunakan, memodifikasi, dan mendistribusikannya.

## 👤 Author

Dibuat dengan ❤️ oleh [Nama Anda/Username GitHub Anda]
