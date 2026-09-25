# MeloSync

MeloSync adalah website musik yang digunakan untuk mencari dan mendengarkan lagu secara online.

Website ini menyediakan fitur seperti pencarian lagu, informasi artis dan album, playlist, lagu favorit, riwayat lagu, serta pengelompokan lagu berdasarkan mood dan aktivitas.

## Tujuan

MeloSync dibuat untuk memudahkan pengguna dalam mencari dan mendengarkan lagu sesuai dengan kebutuhan dan suasana mereka.

MeloSync memiliki konsep pengelompokan lagu berdasarkan mood dan aktivitas, seperti:

* Belajar
* Santai
* Olahraga
* Tidur
* Semangat

Dengan konsep tersebut, pengguna dapat lebih mudah menemukan lagu yang sesuai dengan suasana atau kegiatan yang sedang dilakukan.

## Fitur Utama

* Pencarian lagu
* Pemutaran lagu
* Informasi artis
* Informasi album
* Playlist
* Lagu favorit
* Riwayat lagu
* Playlist berdasarkan mood
* Playlist berdasarkan aktivitas
* Login dan registrasi pengguna

Penjelasan fitur secara lengkap terdapat pada `docs/fitur.md`.

## Teknologi

MeloSync dikembangkan menggunakan:

* React
* TypeScript
* Vite
* ESLint
* Tailwind CSS
* Supabase
* Vercel
* Git
* GitHub

## Tim Pengembang

| Nama   | Role      | Tanggung Jawab                                           |
| ------ | --------- | -------------------------------------------------------- |
| Deva   | DevOps    | Git, GitHub, branch, deployment, dan konfigurasi project |
| Rendra | Front-End | Tampilan website dan implementasi antarmuka              |
| Dimas  | Back-End  | Database, autentikasi, Supabase, dan pengelolaan data    |

## Dokumentasi

Dokumentasi project terdapat pada folder `docs/`.

* `docs/konsep.md` → konsep dan tujuan project
* `docs/fitur.md` → daftar fitur dan penanggung jawab
* `docs/pembagian-tugas.md` → pembagian tugas setiap anggota
* `docs/database.md` → rancangan database

## Struktur Branch

Project menggunakan dua branch utama:

* `main` → versi project yang sudah diperiksa dan stabil
* `develop` → branch pengembangan dan pengecekan

Jika diperlukan, branch fitur dapat dibuat untuk mengerjakan bagian tertentu.

Contoh:

```text
feature/navbar
feature/search
feature/music-player
feature/playlist
feature/supabase
```

Setelah fitur selesai dan diperiksa, perubahan dapat digabungkan ke `develop`.

Jika project sudah stabil, `develop` dapat digabungkan ke `main`.

## Pengembangan Project

Setiap anggota mengerjakan bagian sesuai dengan role dan pembagian tugas.

Setiap perubahan penting dicatat menggunakan Git agar perkembangan project dapat dipantau melalui GitHub.

## Repository

Repository MeloSync:

https://github.com/depipipii/melosync
