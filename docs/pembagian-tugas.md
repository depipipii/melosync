# Pembagian Tugas MeloSync

Dokumen ini berisi pembagian tugas dan tanggung jawab anggota tim dalam pengembangan aplikasi MeloSync.

## Anggota Kelompok

| Nama | Role | Tanggung Jawab Utama |
| ---- | ---- | -------------------- |
| Deva | DevOps | Version Control, Git, GitHub, Environment, Vercel & Deployment |
| Rendra | Front-End | UI/UX, Komponen React, Responsive Design, Music Player, Lyrics View |
| Dimas | Back-End | Supabase, Database PostgreSQL, Client Types, Auth & Integration |
| Faris | QA / Tester | Pengujian Fitur, Cross-browser & Mobile Testing, Pelaporan Bug |

---

# 1. Deva — DevOps

Deva bertanggung jawab atas manajemen repository, infrastruktur version control, konfigurasi environment, dan deployment.

### Tugas Utama:
* Mengelola repository GitHub MeloSync (`main` dan `develop`).
* Memastikan workflow Git berjalan lancar dan melakukan penggabungan (*merge*).
* Mengonfigurasi environment variables (`.env`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
* Menghubungkan project ke Vercel dan memantau status deployment.
* Memastikan build produksi (*production build*) berhasil tanpa error.

### Bagian yang Dikerjakan:
```text
Git & GitHub Workflow
Branch Management (main, develop, feature/*)
Environment Configuration
Vercel Deployment
Build Optimization & CI/CD Checks
```

**Status:** Selesai

---

# 2. Rendra — Front-End

Rendra bertanggung jawab atas pengembangan antarmuka (UI), pengalaman pengguna (UX), serta komponen interaktif aplikasi.

### Tugas Utama:
* Membangun antarmuka modern dengan React, TypeScript, dan Tailwind CSS.
* Mengembangkan komponen utama: `Sidebar`, `PlayerBar`, `Profile`, dan `MobileNav`.
* Mengimplementasikan fitur **Lirik Sinematik** (*auto-scroll* & *interactive jump*).
* Mengembangkan tampilan **Dynamic Ambient Glow** sesuai lagu yang diputar.
* Mengembangkan pemutar musik interaktif (*PlayerBar*) lengkap dengan kontrol volume, progress bar, shuffle, dan repeat.
* Membangun tampilan responsif untuk perangkat seluler dan desktop.
* Mengintegrasikan tampilan dengan data musik dan state aplikasi.

### Bagian yang Dikerjakan:
```text
Navbar & Sidebar UI
Home & Mood Filtering UI
Discover / Genre / Trending Artists UI
Music Player UI (PlayerBar)
Cinematic Lyrics View
Library UI (Playlists, Albums, Artists)
Favorites UI
Profile & Audio Settings Modal UI
Responsive Mobile Navigation
```

**Status:** Selesai

---

# 3. Dimas — Back-End

Dimas bertanggung jawab atas perancangan database, pengelolaan Supabase, autentikasi, serta integrasi data.

### Tugas Utama:
* Merancang skema database PostgreSQL di Supabase.
* Membuat tipe data TypeScript (`Database` interface) di `src/lib/supabase.ts` untuk:
  - `profiles`
  - `songs`
  - `playlists`
  - `artists`
  - `favorites`
  - `recently_played`
* Mengonfigurasi klien Supabase dan penanganan error koneksi otomatis.
* Menyiapkan pengujian koneksi database saat mounting aplikasi.
* Mengatur struktur data lagu (audio URL, cover URL, durasi, mood, aktivitas, lirik JSON).
* Menyiapkan aturan keamanan Row Level Security (RLS) dan Supabase Auth.

### Bagian yang Dikerjakan:
```text
Supabase Project Setup
PostgreSQL Database Schema
TypeScript Database Interfaces (supabase.ts)
Supabase Auth Client Setup
Automatic Connection Verification
Data Modeling (Songs, Playlists, Artists, Favorites, Recently Played)
Row Level Security (RLS) Policy Design
```

**Status:** Selesai

---

# 4. Faris — QA / Tester

Faris bertanggung jawab atas pengujian kualitas aplikasi, verifikasi alur penggunaan, dan pengujian keandalan aplikasi.

### Tugas Utama:
* Menguji seluruh alur pemutaran musik (Play, Pause, Next, Previous, Progress Bar, Volume).
* Menguji fitur pencarian lagu, artis, dan album secara real-time.
* Menguji fungsionalitas lirik sinematik dan fitur *seek audio*.
* Menguji responsivitas tampilan pada berbagai resolusi layar (Mobile, Tablet, Desktop).
* Menguji navigasi antar tab (Home, Discover, Library, Favorites, Profile).
* Melaporkan bug serta melakukan *re-testing* setelah bug diperbaiki.
* Memeriksa kestabilan versi yang telah di-deploy di Vercel.

### Bagian yang Dikerjakan:
```text
Feature Testing (Player, Search, Lyrics, Favorites, Playlists)
UI/UX Responsiveness Testing
Cross-Browser & Device Compatibility
Regression Testing & Bug Verification
Vercel Live Deployment Verification
```

**Status:** Selesai

---

# 5. Workflow Git & Deployment

Struktur branch repository:

```text
main         (versi publik/rilis yang stabil)
 └── develop (branch integrasi fitur)
```

Proses rilis:
1. Pengajuan perubahan dilakukan melalui feature branch.
2. Pengujian lokal dan verifikasi build (`npm run build`).
3. Penggabungan ke branch `develop`, diikuti pengujian QA oleh Faris.
4. Merge ke `main` dan deployment otomatis ke Vercel oleh Deva.

---

# 6. Pembaruan Dokumentasi

Dokumentasi selalu diperbarui setiap kali terjadi perubahan fitur atau struktur project:
- `docs/konsep.md` — Konsep & teknologi aplikasi
- `docs/fitur.md` — Daftar & status fitur terbaru
- `docs/database.md` — Skema database & Supabase TypeScript types
- `docs/pembagian-tugas.md` — Pembagian tugas tim & tanggung jawab
- `README.md` — Ringkasan utama project MeloSync
