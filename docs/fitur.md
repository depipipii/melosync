# Fitur MeloSync

Dokumen ini berisi daftar fitur yang direncanakan untuk MeloSync, deskripsi fitur, penanggung jawab, dan status pengerjaannya.

## Status Fitur

* **Belum** → belum mulai dikerjakan
* **Proses** → sedang dikerjakan
* **Selesai** → sudah selesai dan diperiksa

## Daftar Fitur

| No | Fitur        | Deskripsi                                | Penanggung Jawab | Status |
| -- | ------------ | ---------------------------------------- | ---------------- | ------ |
| 1  | Navbar       | Navigasi utama website                   | Rendra           | Belum  |
| 2  | Beranda      | Menampilkan konten utama dan rekomendasi | Rendra           | Belum  |
| 3  | Pencarian    | Mencari lagu, artis, dan album           | Rendra + Dimas   | Belum  |
| 4  | Detail Lagu  | Menampilkan informasi detail lagu        | Rendra + Dimas   | Belum  |
| 5  | Music Player | Memutar dan mengontrol lagu              | Rendra + Dimas   | Belum  |
| 6  | Artis        | Menampilkan informasi artis              | Rendra + Dimas   | Belum  |
| 7  | Album        | Menampilkan informasi album dan lagu     | Rendra + Dimas   | Belum  |
| 8  | Playlist     | Membuat dan mengelola playlist           | Rendra + Dimas   | Belum  |
| 9  | Favorit      | Menyimpan lagu favorit pengguna          | Rendra + Dimas   | Belum  |
| 10 | Riwayat      | Menyimpan lagu yang pernah diputar       | Rendra + Dimas   | Belum  |
| 11 | Mood         | Pengelompokan lagu berdasarkan mood      | Rendra + Dimas   | Belum  |
| 12 | Aktivitas    | Pengelompokan lagu berdasarkan aktivitas | Rendra + Dimas   | Belum  |
| 13 | Autentikasi  | Login dan registrasi pengguna            | Dimas            | Belum  |
| 14 | Database     | Pengelolaan database MeloSync            | Dimas            | Belum  |
| 15 | Deployment   | Menjalankan website secara online        | Deva             | Belum  |

## 1. Navbar

Navbar digunakan sebagai navigasi utama website.

Menu yang direncanakan:

* Beranda
* Pencarian
* Playlist
* Favorit
* Profil

**Penanggung jawab:** Rendra

## 2. Beranda

Halaman beranda menjadi halaman utama MeloSync.

Konten yang dapat ditampilkan:

* Rekomendasi lagu
* Lagu populer
* Playlist mood
* Playlist aktivitas
* Lagu yang baru diputar

**Penanggung jawab:** Rendra

## 3. Pencarian

Pengguna dapat mencari:

* Judul lagu
* Nama artis
* Nama album

Rendra bertanggung jawab terhadap tampilan pencarian, sedangkan Dimas menangani pengambilan dan pengelolaan data.

**Penanggung jawab:** Rendra + Dimas

## 4. Detail Lagu

Menampilkan informasi lagu seperti:

* Judul lagu
* Artis
* Album
* Cover
* Durasi

**Penanggung jawab:** Rendra + Dimas

## 5. Music Player

Music Player digunakan untuk mengontrol lagu.

Fitur dasar:

* Play
* Pause
* Lagu sebelumnya
* Lagu berikutnya
* Progress lagu
* Volume
* Informasi lagu yang sedang diputar

Rendra mengerjakan tampilan dan interaksi Music Player, sedangkan Dimas menangani data lagu dan sumber audio.

**Penanggung jawab:** Rendra + Dimas

## 6. Playlist

Pengguna dapat membuat dan mengelola playlist sendiri.

Contoh:

```text
Playlist Saya
├── Lagu 1
├── Lagu 2
├── Lagu 3
└── Lagu 4
```

Rendra mengerjakan tampilan playlist, sedangkan Dimas mengelola penyimpanan data playlist.

**Penanggung jawab:** Rendra + Dimas

## 7. Favorit

Pengguna dapat menyimpan lagu yang disukai ke dalam daftar favorit.

**Penanggung jawab:** Rendra + Dimas

## 8. Riwayat

MeloSync menyimpan daftar lagu yang pernah diputar oleh pengguna.

**Penanggung jawab:** Rendra + Dimas

## 9. Mood

Lagu dikelompokkan berdasarkan mood.

Contoh:

```text
Mood
├── Santai
├── Semangat
├── Bahagia
├── Sedih
└── Fokus
```

**Penanggung jawab:** Rendra + Dimas

## 10. Aktivitas

Lagu dikelompokkan berdasarkan aktivitas.

Contoh:

```text
Aktivitas
├── Belajar
├── Bekerja
├── Olahraga
├── Tidur
└── Perjalanan
```

**Penanggung jawab:** Rendra + Dimas

## 11. Autentikasi

Pengguna dapat membuat akun dan login.

Fitur:

* Registrasi
* Login
* Logout
* Pengelolaan session

**Penanggung jawab:** Dimas

## 12. Database

Database digunakan untuk menyimpan:

* Data pengguna
* Data artis
* Data album
* Data lagu
* Data playlist
* Data favorit
* Data riwayat

**Penanggung jawab:** Dimas

## 13. Deployment

Website akan di-deploy agar dapat diakses secara online.

Deva bertanggung jawab terhadap:

* Konfigurasi deployment
* Repository GitHub
* Branch
* Vercel
* Pengecekan deployment

**Penanggung jawab:** Deva

## Catatan

Beberapa fitur dikerjakan oleh lebih dari satu anggota karena membutuhkan kerja sama antara Front-End dan Back-End.

Pembagian dapat diperbarui apabila terdapat perubahan selama pengembangan.
