# Pembagian Tugas MeloSync

Dokumen ini berisi pembagian tugas anggota kelompok dalam pengembangan MeloSync.

## Anggota Kelompok

| Nama   | Role      |
| ------ | --------- |
| Deva   | DevOps    |
| Rendra | Front-End |
| Dimas  | Back-End  |

# 1. Deva — DevOps

Deva bertanggung jawab terhadap kebutuhan pengembangan, version control, dan deployment project.

### Tugas Utama

* Mengelola repository GitHub.
* Mengatur branch Git.
* Menjaga workflow `main` dan `develop`.
* Membantu mengatur branch fitur.
* Mengatur konfigurasi project yang berkaitan dengan deployment.
* Melakukan deployment menggunakan Vercel.
* Memeriksa hasil deployment.
* Membantu memastikan project dapat dijalankan dengan baik.
* Membantu proses merge dari `develop` ke `main`.

### Bagian yang Dikerjakan

```text
Git
GitHub
Branch
Vercel
Deployment
Project Configuration
```

### Branch

Jika diperlukan, Deva dapat menggunakan:

```text
feature/deployment
feature/project-config
```

# 2. Rendra — Front-End

Rendra bertanggung jawab terhadap tampilan dan interaksi pengguna pada website MeloSync.

### Tugas Utama

* Membuat tampilan website.
* Membuat komponen React.
* Menggunakan Tailwind CSS.
* Membuat halaman website.
* Membuat navigasi.
* Membuat tampilan pencarian.
* Membuat tampilan playlist.
* Membuat tampilan favorit.
* Membuat tampilan Music Player.
* Menghubungkan tampilan dengan data dari Back-End.

### Bagian yang Dikerjakan

```text
Navbar
Beranda
Search
Detail Lagu
Artis
Album
Playlist UI
Favorite UI
Music Player UI
Mood UI
Activity UI
```

### Branch

Jika diperlukan:

```text
feature/navbar
feature/home
feature/search
feature/music-player
feature/playlist
feature/mood-activity
```

# 3. Dimas — Back-End

Dimas bertanggung jawab terhadap pengelolaan data dan layanan Back-End menggunakan Supabase.

### Tugas Utama

* Membuat database.
* Membuat struktur tabel.
* Mengatur relasi antar tabel.
* Mengatur Supabase.
* Membuat sistem autentikasi.
* Mengelola data lagu.
* Mengelola data artis dan album.
* Mengelola playlist.
* Mengelola favorit.
* Mengelola riwayat lagu.
* Mengatur Supabase Storage.
* Menyediakan data yang dibutuhkan Front-End.

### Bagian yang Dikerjakan

```text
Supabase
Database
Authentication
Storage
Songs
Artists
Albums
Playlists
Favorites
Recently Played
```

### Branch

Jika diperlukan:

```text
feature/supabase
feature/database
feature/auth
feature/music-data
```

# 4. Kerja Sama Antar Anggota

Beberapa fitur membutuhkan kerja sama antara Front-End dan Back-End.

Contohnya:

```text
Rendra
Front-End
   │
   │ mengambil / mengirim data
   ↓
Dimas
Back-End
   │
   ↓
Supabase
```

Contoh pada fitur playlist:

```text
Rendra
Membuat tampilan playlist
        ↓
Dimas
Menyimpan data playlist
        ↓
Supabase
Database playlist
```

# 5. Workflow Git

Branch utama:

```text
main
develop
```

### main

Digunakan untuk versi project yang sudah stabil dan diperiksa.

### develop

Digunakan untuk pengembangan dan pengecekan sebelum masuk ke `main`.

### Feature Branch

Jika fitur cukup besar, anggota dapat membuat branch:

```text
feature/nama-fitur
```

Contoh:

```text
feature/navbar
feature/search
feature/playlist
feature/supabase
```

Setelah selesai:

```text
feature/*
     ↓
  develop
     ↓
   main
```

# 6. Aturan Commit

Commit harus menjelaskan perubahan yang dilakukan.

Contoh:

```text
Membuat komponen navbar
Membuat halaman pencarian
Membuat tampilan music player
Menambahkan koneksi Supabase
Membuat tabel songs
Menambahkan konfigurasi Vercel
```

Hindari commit message yang terlalu umum seperti:

```text
Update
Fix
Perubahan
Test
```

# 7. Pengecekan Sebelum Masuk main

Sebelum perubahan masuk ke `main`:

1. Fitur sudah selesai.
2. Fitur sudah diuji.
3. Tidak menyebabkan fitur lain bermasalah.
4. Perubahan sudah berada di `develop`.
5. Project dapat dijalankan.
6. Deployment dapat diperiksa jika diperlukan.

Setelah project dianggap stabil, `develop` dapat digabungkan ke `main`.

# 8. Pembaruan Dokumentasi

Jika terdapat perubahan pada fitur atau pembagian tugas, dokumentasi harus diperbarui.

Dokumen yang berkaitan:

```text
docs/konsep.md
docs/fitur.md
docs/pembagian-tugas.md
docs/database.md
```
