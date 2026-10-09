# Fitur MeloSync

Dokumen ini berisi daftar fitur yang dirancang dan diimplementasikan pada MeloSync, deskripsi fitur, penanggung jawab, serta status pengerjaannya.

## Status Fitur

* **Belum** → belum mulai dikerjakan
* **Proses** → sedang dalam tahap pengembangan/integrasi
* **Selesai** → fitur telah diimplementasikan, diuji, dan berfungsi dengan baik

## Daftar Fitur

| No | Fitur | Deskripsi | Penanggung Jawab | Status |
| -- | ----- | --------- | ---------------- | ------ |
| 1 | Navbar & Navigasi | Navigasi utama (Sidebar Desktop & Mobile Nav Bar) | Rendra | Selesai |
| 2 | Beranda (Home) | Menampilkan lagu pilihan, filter mood, dan pemutar musik | Rendra | Selesai |
| 3 | Pencarian (Search) | Pencarian lagu, artis, album, dan playlist secara real-time | Rendra + Dimas | Selesai |
| 4 | Lirik Sinematik & Detail | Tampilan lirik lagu interaktif sinkron dengan audio | Rendra + Dimas | Selesai |
| 5 | Music Player | Bar pemutar musik lengkap (play, pause, next, prev, volume, progress) | Rendra + Dimas | Selesai |
| 6 | Artis | Menampilkan informasi artis populer & daftar artis di Perpustakaan | Rendra + Dimas | Selesai |
| 7 | Album | Menampilkan daftar album dan jumlah lagu di Perpustakaan | Rendra + Dimas | Selesai |
| 8 | Playlist | Mengelola dan memutar koleksi playlist pengguna | Rendra + Dimas | Selesai |
| 9 | Favorit | Menyimpan dan mengelola daftar lagu disukai | Rendra + Dimas | Selesai |
| 10 | Riwayat Putar | Menyimpan dan menampilkan riwayat lagu yang baru diputar | Rendra + Dimas | Selesai |
| 11 | Mood | Pengelompokan dan penyaringan lagu berdasarkan mood | Rendra + Dimas | Selesai |
| 12 | Aktivitas | Pengelompokan lagu sesuai aktivitas (Belajar, Santai, Olahraga, dll.) | Rendra + Dimas | Selesai |
| 13 | Autentikasi & Profil | Integrasi Supabase Auth, manajemen profil pengguna & pengaturan | Dimas + Rendra | Selesai |
| 14 | Database Integration | Pengelolaan tabel Supabase PostgreSQL & client initialization | Dimas | Selesai |
| 15 | Deployment | Konfigurasi project Vite & Vercel deployment | Deva | Selesai |
| 16 | Fullscreen Mode | Mode tampilan penuh tanpa gangguan | Rendra | Selesai |
| 17 | Dynamic Ambient Glow | Efek pencahayaan dinamis mengikuti tema lagu aktif | Rendra | Selesai |

---

## Detail Fitur

### 1. Navbar & Navigasi
Menyediakan navigasi utama aplikasi:
* **Desktop Sidebar**: Akses cepat ke Home, Discover, Library, Favorites, dan Profile, serta widget profil di bagian bawah.
* **Mobile Nav**: Bottom navigation bar untuk pengalaman terbaik di perangkat seluler.

**Penanggung jawab:** Rendra  
**Status:** Selesai

---

### 2. Beranda (Home)
Halaman utama MeloSync dengan tampilan modern:
* Filter kategori mood cepat di bagian atas (*All, Santai, Semangat, Fokus, Tidur, Belajar*).
* Daftar lagu terpopuler beserta equalizer animasi untuk lagu yang sedang diputar.
* Integrasi langsung dengan pemutar musik.

**Penanggung jawab:** Rendra  
**Status:** Selesai

---

### 3. Pencarian (Search)
Input pencarian di bagian header:
* Pencarian cepat berdasarkan judul lagu atau nama artis.
* Penyaringan otomatis pada tampilan Home, Discover, Favorites, dan Library.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 4. Lirik Sinematik (Cinematic Lyrics View)
Tampilan lirik lagu interaktif:
* Lirik bergerak dan tersinkronisasi secara otomatis sesuai posisi pemutaran lagu (*auto-scroll*).
* Pengguna dapat mengklik baris lirik untuk melompat (*seek*) ke bagian lagu yang diinginkan.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 5. Music Player
Player bar yang selalu tampil di bagian bawah layar:
* Kontrol Play / Pause, Previous, Next, Shuffle, dan Repeat.
* Baris kemajuan (*progress bar*) yang dapat digeser untuk navigasi waktu.
* Pengatur volume audio dan tombol pengalih layar penuh / lirik.
* Informasi cover art, judul lagu, dan nama artis.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 6. Artis & Discover
Eksplorasi musik dan artis populer:
* Kategori *Trending Artists* dan *Browse Genres* di menu Discover.
* Daftar artis di tab Perpustakaan beserta informasi jumlah pendengar bulanan dan genre.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 7. Album
Pengelompokan musik berdasarkan album:
* Tab Album di Perpustakaan menampilkan cover art, artis, tahun rilis, dan total lagu.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 8. Playlist
Pengelolaan daftar putar lagu:
* Tampilan kartu playlist dengan indikator jumlah lagu.
* Opsi pemutaran cepat untuk seluruh playlist.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 9. Favorit
Fitur penyimpan lagu kesukaan:
* Tombol hati (*Heart icon*) pada setiap baris lagu.
* Halaman khusus **Favorites** untuk melihat semua lagu yang ditandai sebagai favorit.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 10. Riwayat Putar (Recently Played)
Fitur pencatatan riwayat pemutaran:
* Ditampilkan pada menu **Profile** di bagian *Recently Played Tracks*.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 11. Mood & Aktivitas
Pengelompokan lagu berdasarkan suasana dan kegiatan:
* Kategori mood: Santai, Semangat, Fokus, Tidur, Belajar, dll.
* Lagu dapat difilter secara langsung dari halaman utama.

**Penanggung jawab:** Rendra + Dimas  
**Status:** Selesai

---

### 12. Autentikasi & Profil Pengguna
Sistem profil dan autentikasi:
* Pengaturan profil pengguna (Nama, Bio, Avatar).
* Modal *Edit Profile* interaktif dengan seleksi avatar.
* Pengaturan kualitas audio (Hi-Res Lossless, High Quality), Equalizer, dan Crossfade.
* Klien Supabase Auth siap pakai.

**Penanggung jawab:** Dimas + Rendra  
**Status:** Selesai

---

### 13. Database Integration
Back-End Supabase:
* Definisi tipe TypeScript untuk tabel `profiles`, `songs`, `playlists`, `artists`, `favorites`, dan `recently_played`.
* Pengujian otomatis koneksi ke Supabase saat aplikasi di-mount.

**Penanggung jawab:** Dimas  
**Status:** Selesai

---

### 14. Deployment
Deployment dan version control:
* Pengaturan repository GitHub, branch `main` & `develop`.
* Siap di-deploy ke Vercel dengan build Vite yang optimal.

**Penanggung jawab:** Deva  
**Status:** Selesai

---

### 15. Fullscreen Mode & Dynamic Ambient Glow
Pengalaman visual premium:
* Tombol perbesaran ke Fullscreen di header.
* Radial ambient glow di latar belakang yang menyesuaikan warna lagu aktif secara halus.

**Penanggung jawab:** Rendra  
**Status:** Selesai
