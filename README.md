# MeloSync

MeloSync adalah website musik yang digunakan untuk mencari dan mendengarkan lagu secara online.

Website ini menyediakan fitur pencarian lagu, pemutaran lagu, informasi artis dan album, playlist, lagu favorit, riwayat lagu, serta pengelompokan lagu berdasarkan mood dan aktivitas.

## Tujuan

MeloSync dibuat untuk memudahkan pengguna dalam mencari dan mendengarkan lagu sesuai dengan kebutuhan dan suasana mereka.

MeloSync memiliki konsep pengelompokan lagu berdasarkan mood dan aktivitas, seperti:

- Belajar
- Santai
- Olahraga
- Tidur
- Semangat

Dengan konsep tersebut, pengguna dapat lebih mudah menemukan lagu yang sesuai dengan suasana atau kegiatan yang sedang dilakukan.

## Fitur Utama

### Pengguna

- Registrasi akun
- Login dan logout
- Pengelolaan profil pengguna

### Musik

- Pencarian lagu
- Pemutaran lagu
- Informasi lagu
- Informasi artis
- Informasi album

### Playlist

- Membuat playlist
- Menambahkan lagu ke playlist
- Menghapus lagu dari playlist
- Melihat playlist pengguna

### Favorit dan Riwayat

- Menambahkan lagu ke favorit
- Menghapus lagu dari favorit
- Melihat daftar lagu favorit
- Menyimpan riwayat lagu yang diputar
- Melihat riwayat lagu

### Mood dan Aktivitas

Pengguna dapat menemukan lagu berdasarkan mood dan aktivitas, seperti:

- Belajar
- Santai
- Olahraga
- Tidur
- Semangat

Penjelasan fitur secara lengkap terdapat pada `docs/fitur.md`.

## Teknologi

MeloSync dikembangkan menggunakan:

### Front-End
- React
- TypeScript
- Vite
- Tailwind CSS
- ESLint

### Back-End dan Database
- Supabase
- PostgreSQL
- Supabase Authentication

### Deployment
- Vercel

### Version Control
- Git
- GitHub

## Tim Pengembang

| **Nama** | **Role** | **Tanggung Jawab** |
| -------- | -------- | ------------------ |
| Deva | DevOps | Git, GitHub, branch, environment configuration, Vercel, deployment, dan pengelolaan versi project |
| Rendra | Front-End | UI/UX website, implementasi antarmuka, responsive design, dan integrasi tampilan dengan data aplikasi |
| Dimas | Back-End | Supabase, database PostgreSQL, authentication, struktur tabel, pengelolaan data, dan integrasi backend |
| Faris | QA / Tester | Pengujian fitur, pencarian bug, pengecekan alur aplikasi, pengujian authentication, dan pelaporan bug |

## Pembagian Tanggung Jawab

### Deva — DevOps

- Mengelola repository GitHub
- Mengatur branch `main` dan `develop`
- Membuat dan mengatur branch fitur jika diperlukan
- Mengatur workflow Git
- Mengatur environment variables
- Menghubungkan project dengan Vercel
- Melakukan deployment ke Vercel
- Memastikan project dapat diakses setelah deployment
- Membantu menjaga kestabilan versi `main`

### Rendra — Front-End

- Membuat struktur halaman website
- Membuat komponen UI
- Membuat responsive design
- Membuat halaman utama
- Membuat halaman pencarian
- Membuat halaman detail lagu
- Membuat halaman artis dan album
- Membuat music player
- Membuat halaman playlist
- Membuat halaman favorit
- Membuat halaman riwayat
- Membuat tampilan mood dan aktivitas
- Mengintegrasikan UI dengan data dari Supabase

### Dimas — Back-End

- Membuat dan mengelola project Supabase
- Merancang database PostgreSQL
- Membuat tabel dan relasi database
- Mengatur Supabase Authentication
- Mengelola data pengguna
- Mengelola data lagu
- Mengelola data artis dan album
- Mengelola data playlist
- Mengelola data favorit
- Mengelola data riwayat
- Mengelola data mood dan aktivitas
- Mengatur Row Level Security (RLS)
- Menyediakan integrasi data untuk kebutuhan Front-End

### Faris — QA / Tester

- Menguji setiap fitur yang telah selesai
- Menguji registrasi, login, dan logout
- Menguji pencarian dan pemutaran lagu
- Menguji playlist
- Menguji favorit
- Menguji riwayat
- Menguji fitur mood dan aktivitas
- Mengecek responsive interface
- Mencari error dan bug
- Membuat laporan bug melalui GitHub Issues
- Melakukan retest setelah bug diperbaiki
- Melakukan pengecekan pada versi yang sudah di-deploy di Vercel

## Dokumentasi

Dokumentasi project terdapat pada folder `docs/`.

- `docs/konsep.md` → konsep dan tujuan project
- `docs/fitur.md` → daftar fitur dan penanggung jawab
- `docs/pembagian-tugas.md` → pembagian tugas setiap anggota
- `docs/database.md` → rancangan database

## Struktur Branch

Project menggunakan dua branch utama:

- `main` → versi project yang sudah diperiksa dan stabil
- `develop` → branch pengembangan dan pengecekan

Jika diperlukan, branch fitur dapat dibuat untuk mengerjakan bagian tertentu.

Contoh:

```text
feature/navbar
feature/search
feature/music-player
feature/playlist
feature/supabase
feature/auth
```

Setelah fitur selesai dan diperiksa, perubahan dapat digabungkan ke `develop`.

Jika project sudah stabil, `develop` dapat digabungkan ke `main`.

## Repository

Repository MeloSync:

https://github.com/depipipii/melosync
