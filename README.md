# MeloSync

MeloSync adalah web music player modern yang digunakan untuk mencari, mengelola, dan mendengarkan musik secara online dengan antarmuka yang imersif dan kaya fitur.

Aplikasi ini menyediakan fitur pemutaran lagu, pencarian real-time, **lirik sinematik interaktif**, **latar belakang ambient glow dinamis**, mode layar penuh (*fullscreen*), pengelolaan playlist, daftar favorit, riwayat lagu, profil pengguna & pengaturan audio, serta pengelompokan lagu berdasarkan **mood dan aktivitas**.

---

## Tujuan

MeloSync dibuat untuk memberikan pengalaman mendengarkan musik yang lebih personal, visual, dan efisien. Pengguna dapat memilih lagu sesuai dengan suasana hati (*mood*) maupun kegiatan yang sedang dikerjakan tanpa membuang waktu mencari lagu secara manual.

Konsep mood dan aktivitas mencakup:
- **Belajar**
- **Santai**
- **Olahraga**
- **Tidur**
- **Semangat**
- **Fokus**

---

## Fitur Utama

### Pengguna & Profil
- Pengelolaan profil pengguna (Nama, Bio, Avatar, Lokasi, Membership Tier)
- Modal *Edit Profile* interaktif & seleksi avatar
- Pengaturan audio (Hi-Res Lossless, Equalizer, Crossfade)

### Musik & Pemutar (Music Player)
- Pemutar musik interaktif (Play/Pause, Next/Prev, Progress Bar, Volume Control)
- **Lirik Sinematik Interaktif** (*auto-scroll* & lompat waktu pemutaran)
- **Dynamic Ambient Glow** (Warna background menyesuaikan lagu aktif)
- Mode **Fullscreen** untuk tampilan tanpa gangguan
- Pencarian lagu, artis, dan album secara real-time

### Perpustakaan Musik
- Pengelolaan playlist pengguna & sistem
- Daftar lagu favorit (*Favorites*)
- Pengelompokan album dan artis populer
- Pencatatan riwayat lagu yang baru diputar (*Recently Played*)

### Mood & Aktivitas
- Penyaringan lagu berdasarkan kategori mood dan kegiatan

> Penjelasan detail mengenai seluruh fitur dapat dibaca pada [docs/fitur.md](file:///d:/Project-Github/melosync/docs/fitur.md).

---

## Teknologi

MeloSync dikembangkan menggunakan stack modern:

### Front-End
- **React (v18+)**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Ikonografi Modern)
- **ESLint**

### Back-End & Database
- **Supabase** (Client Integration & Connection Verification)
- **PostgreSQL Database** (Skema type-safe pada `src/lib/supabase.ts`)
- **Supabase Authentication**

### Deployment & Version Control
- **Vercel**
- **Git & GitHub**

---

## Tim Pengembang

| Nama | Role | Tanggung Jawab Utama |
| ---- | ---- | -------------------- |
| **Deva** | DevOps | Git, GitHub, branch management, environment config, Vercel deployment |
| **Rendra** | Front-End | UI/UX, React components, Music Player, Cinematic Lyrics, Responsive styling |
| **Dimas** | Back-End | Supabase PostgreSQL, Authentication, Database TypeScript types & integration |
| **Faris** | QA / Tester | Pengujian fitur, cross-browser/mobile testing, error handling & reporting |

---

## Pembagian Tanggung Jawab

### Deva — DevOps
- Mengelola repository GitHub MeloSync
- Mengatur workflow branch `main` dan `develop`
- Mengatur environment variables (`.env`)
- Menghubungkan project dan deployment otomatis ke Vercel
- Memastikan kestabilan rilis produk

### Rendra — Front-End
- Membangun komponen UI (`Sidebar`, `PlayerBar`, `Profile`, `MobileNav`)
- Mengembangkan tampilan **Lirik Sinematik** dan **Dynamic Ambient Glow**
- Implementasi Music Player dan kontrol audio interaktif
- Membangun tata letak responsif untuk perangkat mobile dan desktop
- Mengintegrasikan antarmuka dengan state aplikasi

### Dimas — Back-End
- Merancang dan membuat skema database PostgreSQL Supabase
- Menulis TypeScript Database Interface (`src/lib/supabase.ts`)
- Menyiapkan penanganan error koneksi & pengujian otomatis pada mount aplikasi
- Merancang aturan Row Level Security (RLS) & Auth Supabase

### Faris — QA / Tester
- Pengujian fungsionalitas pemutar musik, pencarian, dan lirik interaktif
- Pengujian antarmuka pada berbagai ukuran layar (*responsive testing*)
- Pelaporan bug melalui GitHub Issues dan verifikasi perbaikan (*re-testing*)
- Pengujian versi aplikasi yang sudah di-deploy pada Vercel

---

## Dokumentasi Project

Dokumentasi lengkap project MeloSync tersimpan di dalam folder `docs/`:

- [docs/konsep.md](file:///d:/Project-Github/melosync/docs/konsep.md) → Konsep utama, keunikan, dan alur aplikasi
- [docs/fitur.md](file:///d:/Project-Github/melosync/docs/fitur.md) → Daftar fitur lengkap, penanggung jawab, dan status
- [docs/pembagian-tugas.md](file:///d:/Project-Github/melosync/docs/pembagian-tugas.md) → Pembagian tugas tim pengembang
- [docs/database.md](file:///d:/Project-Github/melosync/docs/database.md) → Rancangan skema database & Supabase integration

---

## Struktur Branch

Project menggunakan workflow dua branch utama:

- `main` → Versi produk teruji dan stabil (diterbitkan ke Vercel)
- `develop` → Branch utama pengembangan dan integrasi fitur

```text
main
 └── develop
      ├── feature/navbar
      ├── feature/search
      ├── feature/music-player
      ├── feature/lyrics
      └── feature/supabase
```

---

## Repository

Repository MeloSync:  
[https://github.com/depipipii/melosync](https://github.com/depipipii/melosync)
