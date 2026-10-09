# Database MeloSync

MeloSync menggunakan **Supabase** sebagai layanan Back-End dan database PostgreSQL.

Database dirancang dan diintegrasikan dengan TypeScript Types yang aman (*type-safe*) pada file `src/lib/supabase.ts`.

---

# 1. Fungsi Database

Database digunakan untuk menyimpan dan mengelola:

* Data profil pengguna (`profiles`)
* Data artis (`artists`)
* Data album (`albums`)
* Data lagu & lirik (`songs`)
* Data playlist (`playlists`)
* Data lagu favorit (`favorites`)
* Data riwayat pemutaran (`recently_played`)
* Data mood dan aktivitas

---

# 2. Gambaran Relasi

Gambaran hubungan antar data:

```text
Profiles (Users)
 │
 ├── Favorites ───────────── Songs
 │                            │
 ├── Recently Played ─────── Songs
 │                            │
 └── Playlists                │
       │                      │
       └── Playlist Songs ─── Songs
                              │
                    ┌─────────┴─────────┐
                    │                   │
                 Artists              Albums
```

---

# 3. Tabel `profiles` (Users)

Menyimpan data profil publik dan informasi akun pengguna.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID pengguna (terhubung dengan Supabase Auth) |
| `email` | TEXT | Email pengguna |
| `username` | TEXT | Username pengguna |
| `display_name` | TEXT | Nama tampilan pengguna |
| `bio` | TEXT | Biografi / deskripsi singkat |
| `avatar_url` | TEXT | URL foto profil pengguna |
| `location` | TEXT | Lokasi pengguna |
| `membership_tier` | TEXT | Tingkat keanggotaan (contoh: Pro Hi-Fi Member) |
| `created_at` | TIMESTAMP | Waktu profil dibuat |
| `updated_at` | TIMESTAMP | Waktu profil terakhir diperbarui |

---

# 4. Tabel `artists`

Menyimpan informasi tentang artis / musisi.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID artis |
| `name` | TEXT | Nama artis |
| `genre` | TEXT | Genre musik utama |
| `monthly_listeners` | INTEGER | Jumlah pendengar bulanan |
| `image_url` | TEXT | URL foto artis |
| `description` | TEXT | Biografi / deskripsi artis |
| `created_at` | TIMESTAMP | Waktu data dibuat |
| `updated_at` | TIMESTAMP | Waktu data diperbarui |

---

# 5. Tabel `albums`

Menyimpan informasi album musik.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID album |
| `artist_id` | UUID (FK) | ID artis pemilik album |
| `title` | TEXT | Judul album |
| `cover_url` | TEXT | URL gambar sampul album |
| `release_date` | DATE | Tanggal rilis album |
| `created_at` | TIMESTAMP | Waktu data dibuat |

---

# 6. Tabel `songs`

Menyimpan informasi detail lagu, audio, lirik, serta gaya visual ambient.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID lagu |
| `artist_id` | UUID (FK) | ID artis |
| `album_id` | UUID (FK) | ID album (opsional) |
| `title` | TEXT | Judul lagu |
| `duration_seconds` | INTEGER | Durasi lagu dalam detik |
| `mood` | TEXT | Kategori mood (Santai, Semangat, Fokus, dll.) |
| `activity` | TEXT | Kategori aktivitas (Belajar, Olahraga, Tidur, dll.) |
| `audio_url` | TEXT | URL file audio lagu |
| `cover_url` | TEXT | URL gambar cover lagu |
| `lyrics` | JSONB / TEXT | Data lirik tersinkronisasi (waktu & teks) |
| `glow_primary` | TEXT | Warna glow ambient utama (Tailwind class) |
| `glow_secondary` | TEXT | Warna glow ambient sekunder (Tailwind class) |
| `source_type` | TEXT | Sumber audio (contoh: local, storage, stream) |
| `is_active` | BOOLEAN | Status keaktifan lagu |
| `created_at` | TIMESTAMP | Waktu data dibuat |
| `updated_at` | TIMESTAMP | Waktu data diperbarui |

---

# 7. Tabel `playlists`

Menyimpan data playlist buatan pengguna maupun sistem.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID playlist |
| `owner_user_id` | UUID (FK) | ID pemilik playlist (null jika playlist sistem) |
| `name` | TEXT | Nama playlist |
| `description` | TEXT | Deskripsi playlist |
| `cover_url` | TEXT | URL cover playlist |
| `is_public` | BOOLEAN | Status publik / privat |
| `is_system` | BOOLEAN | Status playlist buatan sistem |
| `created_at` | TIMESTAMP | Waktu playlist dibuat |
| `updated_at` | TIMESTAMP | Waktu playlist diperbarui |

---

# 8. Tabel `playlist_songs`

Tabel penghubung (*junction table*) antara playlist dan lagu.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID data |
| `playlist_id` | UUID (FK) | ID playlist |
| `song_id` | UUID (FK) | ID lagu |
| `added_at` | TIMESTAMP | Waktu lagu ditambahkan ke playlist |

---

# 9. Tabel `favorites`

Menyimpan daftar lagu favorit pengguna.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID data favorit |
| `user_id` | UUID (FK) | ID pengguna |
| `song_id` | UUID (FK) | ID lagu yang difavoritkan |
| `created_at` | TIMESTAMP | Waktu lagu ditambahkan ke favorit |

---

# 10. Tabel `recently_played`

Menyimpan riwayat pemutaran lagu pengguna.

| Kolom | Tipe | Keterangan |
| ----- | ---- | ---------- |
| `id` | UUID (PK) | ID data riwayat |
| `user_id` | UUID (FK) | ID pengguna |
| `song_id` | UUID (FK) | ID lagu yang diputar |
| `played_at` | TIMESTAMP | Waktu lagu diputar |

---

# 11. Mood dan Aktivitas

Mood dan aktivitas disimpan langsung sebagai atribut pada tabel `songs` untuk performa pencarian yang optimal:

```text
Songs
├── mood: Santai, Semangat, Fokus, Tidur, Belajar
└── activity: Belajar, Bekerja, Olahraga, Tidur, Bersantai
```

---

# 12. Integrasi Supabase Client

Aplikasi MeloSync secara otomatis menguji koneksi ke Supabase saat aplikasi di-mount:

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
```

---

# 13. Penanggung Jawab & Status Implementation

| Bagian | Penanggung Jawab | Status |
| ------ | ---------------- | ------ |
| Rancangan Database Schema | Dimas | Selesai |
| Tabel `profiles` & Types | Dimas | Selesai |
| Tabel `artists` & Types | Dimas | Selesai |
| Tabel `albums` & Types | Dimas | Selesai |
| Tabel `songs` & Types | Dimas | Selesai |
| Tabel `playlists` & Types | Dimas | Selesai |
| Tabel `favorites` & Types | Dimas | Selesai |
| Tabel `recently_played` & Types | Dimas | Selesai |
| Supabase Auth Client Configuration | Dimas | Selesai |
| Client Mount Verification (`App.tsx`) | Dimas + Rendra | Selesai |

---

# 14. Keamanan & Row Level Security (RLS)

* Data pengguna dilindungi dengan aturan Supabase Row Level Security (RLS).
* Playlist dan Favorit milik pengguna hanya dapat dimodifikasi oleh pemilik akun yang sah.
* Data `songs`, `artists`, dan `albums` berstatus read-only untuk publik.
