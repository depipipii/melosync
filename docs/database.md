# Database MeloSync

MeloSync menggunakan **Supabase** sebagai layanan Back-End dan database.

Database dirancang menggunakan PostgreSQL yang disediakan oleh Supabase.

> Struktur database ini merupakan rancangan awal dan dapat berubah sesuai kebutuhan project.

# 1. Fungsi Database

Database digunakan untuk menyimpan dan mengelola:

* Data pengguna
* Data artis
* Data album
* Data lagu
* Data playlist
* Data lagu favorit
* Data riwayat lagu
* Data mood
* Data aktivitas

# 2. Gambaran Relasi

Gambaran hubungan antar data:

```text
Users
 │
 ├── Favorites ───────────── Songs
 │
 ├── Recently Played ─────── Songs
 │
 └── Playlists
       │
       └── Playlist Songs ─── Songs
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 Artists              Albums
```

# 3. Tabel Users

Tabel pengguna digunakan untuk menyimpan data tambahan pengguna.

| Kolom      | Tipe      | Keterangan        |
| ---------- | --------- | ----------------- |
| id         | UUID      | ID pengguna       |
| username   | TEXT      | Nama pengguna     |
| email      | TEXT      | Email pengguna    |
| created_at | TIMESTAMP | Waktu akun dibuat |

Autentikasi pengguna akan menggunakan **Supabase Auth**.

# 4. Tabel Artists

Menyimpan informasi artis.

| Kolom       | Tipe      | Keterangan        |
| ----------- | --------- | ----------------- |
| id          | UUID      | ID artis          |
| name        | TEXT      | Nama artis        |
| image_url   | TEXT      | Foto artis        |
| description | TEXT      | Deskripsi artis   |
| created_at  | TIMESTAMP | Waktu data dibuat |

Relasi:

```text
Artists
   │
   └── Songs
```

Satu artis dapat memiliki banyak lagu.

# 5. Tabel Albums

Menyimpan informasi album.

| Kolom        | Tipe      | Keterangan        |
| ------------ | --------- | ----------------- |
| id           | UUID      | ID album          |
| artist_id    | UUID      | ID artis          |
| title        | TEXT      | Nama album        |
| cover_url    | TEXT      | Cover album       |
| release_date | DATE      | Tanggal rilis     |
| created_at   | TIMESTAMP | Waktu data dibuat |

Relasi:

```text
Artists
   │
   └── Albums
          │
          └── Songs
```

# 6. Tabel Songs

Menyimpan informasi lagu.

| Kolom      | Tipe      | Keterangan            |
| ---------- | --------- | --------------------- |
| id         | UUID      | ID lagu               |
| album_id   | UUID      | ID album              |
| artist_id  | UUID      | ID artis              |
| title      | TEXT      | Judul lagu            |
| audio_url  | TEXT      | URL file audio        |
| cover_url  | TEXT      | URL cover lagu        |
| duration   | INTEGER   | Durasi lagu           |
| mood       | TEXT      | Mood lagu             |
| activity   | TEXT      | Aktivitas yang sesuai |
| created_at | TIMESTAMP | Waktu data dibuat     |

Contoh mood:

```text
Santai
Semangat
Bahagia
Sedih
Fokus
```

Contoh aktivitas:

```text
Belajar
Bekerja
Olahraga
Tidur
Perjalanan
```

# 7. Tabel Playlists

Menyimpan playlist yang dibuat pengguna.

| Kolom       | Tipe      | Keterangan         |
| ----------- | --------- | ------------------ |
| id          | UUID      | ID playlist        |
| user_id     | UUID      | ID pengguna        |
| name        | TEXT      | Nama playlist      |
| description | TEXT      | Deskripsi playlist |
| cover_url   | TEXT      | Cover playlist     |
| created_at  | TIMESTAMP | Waktu dibuat       |

Relasi:

```text
Users
  │
  └── Playlists
```

# 8. Tabel Playlist Songs

Tabel penghubung antara playlist dan lagu.

| Kolom       | Tipe      | Keterangan             |
| ----------- | --------- | ---------------------- |
| id          | UUID      | ID data                |
| playlist_id | UUID      | ID playlist            |
| song_id     | UUID      | ID lagu                |
| added_at    | TIMESTAMP | Waktu lagu ditambahkan |

Relasi:

```text
Playlists
    │
    └── Playlist Songs
              │
              └── Songs
```

Satu playlist dapat memiliki banyak lagu.

Satu lagu juga dapat dimasukkan ke beberapa playlist.

# 9. Tabel Favorites

Menyimpan lagu favorit pengguna.

| Kolom      | Tipe      | Keterangan        |
| ---------- | --------- | ----------------- |
| id         | UUID      | ID data           |
| user_id    | UUID      | ID pengguna       |
| song_id    | UUID      | ID lagu           |
| created_at | TIMESTAMP | Waktu ditambahkan |

Relasi:

```text
Users
  │
  └── Favorites ─── Songs
```

# 10. Tabel Recently Played

Menyimpan riwayat lagu yang pernah diputar.

| Kolom     | Tipe      | Keterangan         |
| --------- | --------- | ------------------ |
| id        | UUID      | ID data            |
| user_id   | UUID      | ID pengguna        |
| song_id   | UUID      | ID lagu            |
| played_at | TIMESTAMP | Waktu lagu diputar |

Relasi:

```text
Users
  │
  └── Recently Played ─── Songs
```

# 11. Mood dan Aktivitas

Mood dan aktivitas menjadi salah satu konsep utama MeloSync.

Untuk tahap awal, kategori dapat disimpan langsung pada tabel `songs`.

Contoh:

```text
Songs
│
├── mood
│   ├── Santai
│   ├── Semangat
│   ├── Bahagia
│   ├── Sedih
│   └── Fokus
│
└── activity
    ├── Belajar
    ├── Bekerja
    ├── Olahraga
    ├── Tidur
    └── Perjalanan
```

Jika kebutuhan project berkembang, mood dan aktivitas dapat dipisahkan menjadi tabel tersendiri.

# 12. Supabase Storage

Supabase Storage dapat digunakan untuk menyimpan file seperti:

* Audio lagu
* Cover album
* Foto artis
* Cover playlist

Contoh struktur:

```text
Supabase Storage
│
├── songs/
│   ├── song-1.mp3
│   └── song-2.mp3
│
├── albums/
│   ├── album-1.jpg
│   └── album-2.jpg
│
├── artists/
│   ├── artist-1.jpg
│   └── artist-2.jpg
│
└── playlists/
    ├── playlist-1.jpg
    └── playlist-2.jpg
```

Database menyimpan URL atau informasi yang diperlukan untuk mengakses file tersebut.

# 13. Penanggung Jawab

| Bagian             | Penanggung Jawab | Status |
| ------------------ | ---------------- | ------ |
| Rancangan database | Dimas            | Belum  |
| Users              | Dimas            | Belum  |
| Artists            | Dimas            | Belum  |
| Albums             | Dimas            | Belum  |
| Songs              | Dimas            | Belum  |
| Playlists          | Dimas            | Belum  |
| Playlist Songs     | Dimas            | Belum  |
| Favorites          | Dimas            | Belum  |
| Recently Played    | Dimas            | Belum  |
| Supabase Auth      | Dimas            | Belum  |
| Supabase Storage   | Dimas            | Belum  |

## Bantuan dari Anggota Lain

Rendra akan menggunakan data dari database untuk kebutuhan Front-End.

Contohnya:

```text
Dimas
   ↓
Menyediakan data lagu
   ↓
Rendra
   ↓
Menampilkan data pada website
```

Deva bertanggung jawab terhadap kebutuhan konfigurasi dan deployment yang berkaitan dengan project.

# 14. Catatan Keamanan

Data pengguna harus dikelola dengan aturan keamanan yang sesuai.

Supabase Row Level Security (RLS) akan dipertimbangkan untuk membatasi akses data pengguna.

Contohnya, data playlist dan favorit milik pengguna hanya boleh diakses sesuai dengan hak akses pengguna tersebut.

# 15. Pengembangan Database

Database akan dikembangkan secara bertahap.

Tahapan awal:

```text
1. Membuat project Supabase
2. Membuat tabel
3. Membuat relasi
4. Memasukkan data awal
5. Mengatur keamanan
6. Menghubungkan Supabase dengan Front-End
7. Melakukan pengujian
```

Penanggung jawab utama bagian database adalah **Dimas sebagai Back-End**.
