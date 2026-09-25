# Konsep MeloSync

## 1. Gambaran Umum

MeloSync adalah website musik yang dibuat untuk membantu pengguna mencari dan mendengarkan lagu secara online.

Website ini menyediakan fitur dasar seperti pencarian lagu, pemutaran lagu, informasi artis dan album, playlist, lagu favorit, serta riwayat lagu.

Selain fitur tersebut, MeloSync memiliki konsep pengelompokan lagu berdasarkan **mood dan aktivitas**.

Konsep ini bertujuan untuk membantu pengguna menemukan lagu yang sesuai dengan suasana hati atau kegiatan yang sedang dilakukan.

## 2. Latar Belakang

Musik sering digunakan untuk menemani berbagai aktivitas sehari-hari.

Pengguna dapat mendengarkan musik ketika belajar, bekerja, berolahraga, bersantai, melakukan perjalanan, atau sebelum tidur.

Pengguna terkadang membutuhkan waktu untuk menentukan lagu yang sesuai dengan kondisi atau aktivitas mereka.

MeloSync dibuat dengan konsep pengelompokan musik berdasarkan mood dan aktivitas agar pengguna dapat menemukan pilihan lagu dengan lebih mudah.

## 3. Tujuan Project

Tujuan pembuatan MeloSync adalah:

1. Membuat website musik yang mudah digunakan.
2. Memudahkan pengguna mencari lagu.
3. Memungkinkan pengguna mendengarkan lagu secara online.
4. Menampilkan informasi lagu, artis, dan album.
5. Memungkinkan pengguna membuat playlist.
6. Menyediakan fitur lagu favorit.
7. Menyimpan riwayat lagu yang diputar.
8. Mengelompokkan lagu berdasarkan mood dan aktivitas.

## 4. Target Pengguna

MeloSync ditujukan untuk pengguna yang ingin:

* Mendengarkan musik secara online.
* Mencari lagu tertentu.
* Menemukan lagu berdasarkan mood.
* Menemukan lagu berdasarkan aktivitas.
* Membuat playlist sendiri.
* Menyimpan lagu favorit.

## 5. Konsep Utama

Konsep utama MeloSync adalah **musik berdasarkan mood dan aktivitas**.

### Mood

Contoh kategori mood:

* Santai
* Semangat
* Bahagia
* Sedih
* Fokus

### Aktivitas

Contoh kategori aktivitas:

* Belajar
* Bekerja
* Olahraga
* Tidur
* Perjalanan
* Bersantai

Pengguna dapat memilih kategori yang sesuai dengan kondisi mereka untuk menemukan lagu yang berkaitan dengan kategori tersebut.

## 6. Contoh Penggunaan

Misalnya pengguna sedang belajar.

Pengguna dapat membuka kategori:

```text
Aktivitas → Belajar
```

Kemudian MeloSync menampilkan lagu atau playlist yang sudah dikelompokkan untuk aktivitas belajar.

Contoh lainnya:

```text
Mood → Santai
```

MeloSync kemudian menampilkan lagu yang termasuk dalam kategori santai.

## 7. Alur Penggunaan

Secara umum:

```text
Pengguna
   ↓
Membuka MeloSync
   ↓
Melihat Beranda
   ↓
Mencari Lagu / Memilih Mood / Aktivitas
   ↓
Memilih Lagu
   ↓
Memutar Lagu
   ↓
Menambahkan ke Favorit / Playlist
```

## 8. Teknologi

| Teknologi    | Penggunaan                         |
| ------------ | ---------------------------------- |
| React        | Membuat antarmuka website          |
| TypeScript   | Menulis kode dengan tipe data      |
| Vite         | Menjalankan dan membangun project  |
| ESLint       | Memeriksa kualitas kode            |
| Tailwind CSS | Membuat tampilan website           |
| Supabase     | Database, autentikasi, dan storage |
| Vercel       | Deployment website                 |
| Git          | Version control                    |
| GitHub       | Repository dan kolaborasi          |

## 9. Pembagian Role

### Deva — DevOps

Bertanggung jawab terhadap:

* Git dan GitHub
* Pengelolaan branch
* Workflow pengembangan
* Konfigurasi project
* Deployment ke Vercel
* Menjaga project agar siap untuk proses deployment

### Rendra — Front-End

Bertanggung jawab terhadap:

* Tampilan website
* Komponen React
* Halaman website
* Tailwind CSS
* Navigasi
* Music Player pada sisi antarmuka
* Integrasi tampilan dengan data dari Back-End

### Dimas — Back-End

Bertanggung jawab terhadap:

* Supabase
* Database
* Struktur tabel
* Autentikasi
* Penyimpanan data
* Supabase Storage
* Integrasi data dengan Front-End

## 10. Keunikan MeloSync

Keunikan utama MeloSync adalah pengelompokan musik berdasarkan mood dan aktivitas.

MeloSync tidak hanya berfokus pada pencarian lagu, tetapi juga membantu pengguna menemukan musik berdasarkan kebutuhan mereka.

Contohnya:

> Pengguna sedang belajar → memilih kategori **Belajar** → MeloSync menampilkan lagu yang sesuai.

## 11. Pengembangan

Project dikembangkan menggunakan Git dengan branch utama:

```text
main
│
└── develop
     │
     ├── feature/navbar
     ├── feature/search
     ├── feature/music-player
     ├── feature/playlist
     └── feature/supabase
```

`develop` digunakan untuk proses pengembangan dan pengecekan.

`main` digunakan untuk versi yang sudah stabil.
