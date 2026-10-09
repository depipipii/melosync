# Konsep MeloSync

## 1. Gambaran Umum

MeloSync adalah aplikasi pemutar musik modern berbasis web (*web-based music player*) yang dirancang untuk memberikan pengalaman mendengarkan lagu secara online yang intuitif, cepat, dan kaya fitur.

Selain menyediakan fungsi pemutar musik standar seperti pencarian, pembuatan playlist, dan daftar favorit, MeloSync memiliki keunikan utama yaitu **pengelompokan musik berdasarkan mood dan aktivitas** serta **tampilan lirik sinematik interaktif** dan **latar belakang ambient glow dinamis**.

---

## 2. Latar Belakang

Musik merupakan bagian tak terpisahkan dari aktivitas sehari-hari—mulai dari belajar, bekerja, berolahraga, bersantai, hingga menemani tidur. Pengguna sering kali menghabiskan waktu mencari lagu yang pas dengan suasana hati (*mood*) atau kegiatan yang sedang dijalankan.

MeloSync hadir untuk mempermudah penemuan lagu melalui kategori yang sudah disesuaikan dengan kondisi pengguna, sehingga lagu yang tepat dapat diputar dengan cepat tanpa perlu pencarian manual yang membingungkan.

---

## 3. Tujuan Project

Tujuan utama pengembangan MeloSync:
1. Menyediakan aplikasi pemutar musik web yang cepat, responsif, dan estetik.
2. Memudahkan pengguna menemukan lagu berdasarkan suasana hati (*mood*) dan kegiatan (*activity*).
3. Menyediakan tampilan lirik sinematik tersinkronisasi (*interactive lyrics view*).
4. Memberikan pengalaman visual yang imersif melalui *Dynamic Ambient Glow* dan *Fullscreen Mode*.
5. Menyediakan manajemen perpustakaan musik pribadi (Playlist, Album, Artis, Favorit, dan Riwayat Putar).
6. Mengintegrasikan aplikasi dengan database Supabase PostgreSQL.

---

## 4. Target Pengguna

MeloSync ditujukan bagi pengguna yang ingin:
* Mendengarkan musik secara streaming melalui peramban web.
* Menemukan lagu berdasarkan suasana hati (Santai, Semangat, Fokus, Tidur, dll.).
* Menemukan musik yang cocok untuk menemani aktivitas tertentu (Belajar, Bekerja, Olahraga, dll.).
* Membaca dan bernyanyi dengan lirik lagu yang tersinkronisasi otomatis.
* Mengelola playlist dan daftar lagu favorit secara rapi.

---

## 5. Konsep Utama

### A. Musik Berdasarkan Mood & Aktivitas
Pengguna dapat memilih kategori sesuai kondisi saat ini:
* **Mood:** Santai, Semangat, Bahagia, Sedih, Fokus, Tidur.
* **Aktivitas:** Belajar, Bekerja, Olahraga, Tidur, Perjalanan, Bersantai.

### B. Lirik Sinematik (Cinematic Lyrics)
Menampilkan lirik lagu dengan efek pencahayaan sinematik dan pergerakan lirik otomatis (*auto-scroll*). Pengguna juga dapat mengklik baris lirik mana saja untuk melompat langsung ke detik lagu tersebut.

### C. Dynamic Ambient Glow Background
Warna latar belakang aplikasi menyesuaikan secara otomatis dengan warna khas (*glowPrimary* & *glowSecondary*) lagu yang sedang diputar, menciptakan atmosfer audio-visual yang imersif.

---

## 6. Alur Penggunaan

```text
Pengguna Membuka MeloSync
         │
         ├── Memilih Mood / Aktivitas di Beranda ──► Memutar Lagu
         │
         ├── Menggunakan Pencarian Real-Time ──────► Memutar / Menambah Favorit
         │
         ├── Membuka View Lirik Sinematik ────────► Bernyanyi & Navigasi Waktu Lirik
         │
         └── Membuka Perpustakaan / Profil ────────► Mengelola Playlist & Pengaturan Audio
```

---

## 7. Teknologi yang Digunakan

| Teknologi | Peran & Penggunaan |
| --------- | ------------------ |
| **React (v18+)** | Framework utama pembangun antarmuka pengguna berbasis komponen |
| **TypeScript** | Menjamin keamanan tipe data (*type safety*) pada seluruh aplikasi & database model |
| **Vite** | Build tool modern untuk proses *development* dan pemaketan produksi yang cepat |
| **Tailwind CSS** | Framework CSS utility-first untuk desain responsif, animasi, dan efek glassmorphism |
| **Lucide React** | Ikon vektor modern untuk antarmuka pengguna |
| **Supabase** | Backend-as-a-Service (PostgreSQL database, Auth, & Client integration) |
| **Vercel** | Platform cloud hosting untuk deployment dan pratinjau |
| **Git & GitHub** | Version control dan kolaborasi tim |

---

## 8. Tim Pengembang & Peran

| Nama | Role | Fokus Tanggung Jawab |
| ---- | ---- | -------------------- |
| **Deva** | DevOps | Git workflow, branch management, environment config, Vercel deployment |
| **Rendra** | Front-End | UI/UX React components, Music Player, Cinematic Lyrics, Ambient Glow, Styling |
| **Dimas** | Back-End | Supabase PostgreSQL setup, Database Types TypeScript, Auth, Data Relations |
| **Faris** | QA / Tester | Testing fitur, pengujian antarmuka responsif, verifikasi perbaikan bug, QA build |

---

## 9. Struktur Branch & Workflow Git

Aplikasi dikembangkan menggunakan struktur branch terstandar:

```text
main           (versi stabil terverifikasi)
 └── develop   (branch integrasi pengembangan)
```

Setiap fitur dikembangkan, diuji melalui `npm run build`, dan diverifikasi sebelum digabungkan ke `main` untuk deployment otomatis di Vercel.
