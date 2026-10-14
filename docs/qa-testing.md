# Laporan Pengujian Kualitas (QA Testing Report) — MeloSync

Dokumen ini berisi laporan pengujian menyeluruh (*Quality Assurance & Testing Report*) untuk aplikasi web streaming musik **MeloSync**. Laporan ini mendokumentasikan hasil uji coba fungsionalitas fitur, konsistensi antarmuka (UI/UX), bug yang ditemukan, evaluasi kualitas, serta rekomendasi perubahan dan rencana pengembangan ke depan.

---

## 1. Informasi Pengujian

| Parameter | Keterangan |
| --------- | ---------- |
| **Nama Aplikasi** | MeloSync — Futuristic Music Web App |
| **Versi Aplikasi** | v1.0.0-beta / develop |
| **Tanggal Pengujian** | 14 Oktober 2026 |
| **Penanggung Jawab (QA / Tester)** | Faris (*QA / Quality Engineer*) |
| **Metode Pengujian** | Manual Functional Testing, UI/UX Verification, Cross-Device & Responsive Testing |
| **Lingkungan Uji (Environment)** | Local Development (`localhost:5173`), Vercel Production Build |
| **Perangkat & Browser Pengujian** | Google Chrome (v128+ Desktop), Brave Browser, Mobile Responsive Mode (Pixel 7 / iPhone 14 Pro) |
| **Basis Data & Backend** | Supabase PostgreSQL, Realtime Storage & Auth Client |

---

## 2. Ringkasan Pengujian (Summary)

Pengujian mencakup seluruh menu dan modul navigasi aplikasi MeloSync. Secara garis besar, fondasi navigasi, pemutaran audio dasar, visual lirik, dan modul profil telah berjalan dengan baik. Namun demikian, ditemukan beberapa tombol aksi kontrol yang belum memiliki implementasi logika (*handler*), ketidaksinkronan arah animasi transisi audio, serta potensi redundansi navigasi pada menu koleksi pengguna.

### Metrik Hasil Pengujian

| Metrik | Nilai | Persentase |
| ------ | ----- | ---------- |
| **Total Komponen/Fitur Diuji** | 35 | 100% |
| **Lolos Uji (Passed / ✅)** | 27 | 77.1% |
| **Gagal / Belum Berfungsi (Failed / ❌)** | 8 | 22.9% |
| **Tingkat Kelulusan (Pass Rate)** | **77.1%** | *Memerlukan perbaikan sebelum rilis stabil* |

### Ringkasan Temuan Kritis & Isu Utama

1. **Kontrol Player Belum Lengkap**: Tombol *Shuffle* dan *Repeat* belum terhubung ke algoritma antrean/pemutaran ulang.
2. **Animasi Transisi Tidak Sinkron**: Arah transisi pergerakan visual lagu berkebalikan (maju vs mundur) saat berpindah ke lagu sebelumnya (*Previous*).
3. **Tombol Interaktif Statis**: Tombol opsi tiga titik (*more options*) pada daftar lagu, tombol *Play* di featured banner Discover, dan tautan *See all* belum membuka modal atau tindakan.
4. **Redundansi Fitur**: Halaman *Favorites* dan sub-tab *Saved Music* pada Profile menampilkan data yang identik, membingungkan hierarki navigasi.

---

## 3. Hasil Pengujian Berdasarkan Menu

### 3.1. Menu Navigasi Samping (Left Sidebar)

Navigasi bar desktop di sisi kiri aplikasi yang mengontrol perpindahan antar halaman utama.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Menu Home | Klik tab navigasi Home | Berpindah ke tampilan Beranda dengan lancar | ✅ Pass | Aktif dan ter-highlight dengan benar |
| 2 | Menu Discover | Klik tab navigasi Discover | Membuka katalog penjelajahan lagu & genre | ✅ Pass | Halaman berganti tanpa jeda (*smooth*) |
| 3 | Menu Library | Klik tab navigasi Library | Menampilkan koleksi playlist, album, & artis | ✅ Pass | Tab aktif ter-render sempurna |
| 4 | Menu Favorites | Klik tab navigasi Favorites | Menampilkan daftar lagu yang disukai pengguna | ✅ Pass | Data lagu favorit ter-render |
| 5 | Menu Profile | Klik tab navigasi Profile | Menampilkan info profil, statistik, & pengaturan | ✅ Pass | Widget profil samping sinkron |

---

### 3.2. Bagian Konten Utama (Home)

Halaman utama yang memuat filter mood/kategori, bilah pencarian, dan daftar kurasi lagu.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Filter Kategori: All | Klik tab "All" | Menampilkan seluruh daftar lagu tanpa filter | ✅ Pass | Berjalan sesuai ekspektasi |
| 2 | Filter Kategori: Focus | Klik tab "Focus" | Menyaring daftar lagu dengan tempo fokus | ✅ Pass | Daftar lagu tersaring instan |
| 3 | Filter Kategori: Chill | Klik tab "Chill" | Menyaring daftar lagu bernuansa santai | ✅ Pass | Berjalan sesuai ekspektasi |
| 4 | Filter Kategori: Upbeat | Klik tab "Upbeat" | Menyaring daftar lagu berenergi tinggi | ✅ Pass | Berjalan sesuai ekspektasi |
| 5 | Filter Kategori: Late Night | Klik tab "Late Night" | Menyaring lagu bernuansa malam/tenang | ✅ Pass | Berjalan sesuai ekspektasi |
| 6 | Kolom Pencarian Header | Mengetik kata kunci lagu/artis | Menyaring daftar lagu secara *real-time* | ✅ Pass | Input responsif dan akurat |
| 7 | Profil & Tombol Expand | Klik foto profil & tombol expand di top bar | Menampilkan info/navigasi cepat profil | ✅ Pass | Komponen responsif |
| 8 | Ikon Hati (Favorit Lagu) | Klik ikon hati pada kartu lagu | Status favorit bertambah/berkurang | ✅ Pass | Indikator warna hati berubah sesuai status |
| 9 | Tombol Tiga Titik (More Options) | Klik tombol tiga titik pada baris lagu | Membuka menu pop-up (Add to Queue, Share, Info) | ❌ Fail | Tombol tidak merespons klik (belum ada *event handler*) |

---

### 3.3. Pemutar Musik Bawah (Bottom Media Player)

Bilah pemutar musik persisten di bagian bawah layar beserta kontrol kendali pemutaran audio.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Tombol Play / Pause | Klik tombol play/pause di bar kontrol | Memulai atau menjeda audio secara langsung | ✅ Pass | Sinkron dengan state audio HTML5 |
| 2 | Tombol Next (Lagu Berikutnya) | Klik tombol Next | Berpindah ke lagu berikutnya dalam antrean | ✅ Pass | Audio dan metadata berganti |
| 3 | Tombol Previous (Lagu Sebelumnya) | Klik tombol Previous | Berpindah ke lagu sebelumnya | ✅ Pass | Audio berpindah dengan benar |
| 4 | Tombol Shuffle | Klik tombol Shuffle | Mengacak urutan antrean pemutaran lagu | ❌ Fail | Ikon ada tetapi belum mengubah urutan lagu |
| 5 | Tombol Repeat | Klik tombol Repeat | Mengulang satu lagu (*single*) atau seluruh antrean | ❌ Fail | Status pengulangan lagu belum aktif |
| 6 | Progress Bar & Audio Seeking | Geser / klik posisi progress bar | Audio melompat (*seek*) ke detik yang dipilih | ✅ Pass | Waktu berjalan sinkron dan presisi |
| 7 | Tombol Lirik / Antrean | Klik tombol lirik di kontrol kanan | Membuka modal lirik sinematik & detail lagu | ✅ Pass | Tampilan lirik sinkron dengan audio |
| 8 | Slider & Ikon Volume | Geser slider volume atau klik mute | Mengubah volume audio & mute seketika | ✅ Pass | Volume merespons slider secara proporsional |
| 9 | Tombol Fullscreen (Mode Imersif) | Klik tombol layar penuh | Beralih ke mode imersif layar penuh ala Spotify | ✅ Pass | Menampilkan cover art besar & visualizer |
| 10 | Arah Animasi Transisi Lagu | Berpindah lagu maju (Next) dan mundur (Prev) | Arah pergerakan transisi visual sinkron dengan arah lagu | ❌ Fail | Animasi arah transisi berkebalikan (maju vs mundur tidak sinkron) |

---

### 3.4. Halaman Penjelajahan (Discover)

Halaman eksplorasi musik baru, chart unggulan, genre, dan artis yang sedang tren.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Kolom Pencarian Discover | Mengetik pencarian di tab Discover | Melakukan pencarian khusus katalog discover | ❌ Fail | Kolom pencarian belum berfungsi di halaman ini |
| 2 | Tombol Play Banner Utama | Klik tombol Play di tengah featured chart | Langsung memutar lagu unggulan di banner | ❌ Fail | Tombol Play tidak dapat diklik / statis |
| 3 | Tautan "See All" Genre | Klik tautan "See all" pada bagian Browse Genres | Membuka daftar lengkap seluruh genre | ❌ Fail | Tautan tidak merespons klik |
| 4 | Kartu Genre Musik | Klik salah satu kartu genre (e.g. Synthwave, Lofi) | Masuk ke tampilan detail mode imersif genre terkait | ✅ Pass | Beralih ke tampilan khusus genre |
| 5 | Kartu Trending Artists | Klik salah satu artis populer | Masuk ke tampilan profil imersif artis terkait | ✅ Pass | Membuka detail diskografi artis |

---

### 3.5. Halaman Koleksi (Library)

Pusat pengelolaan koleksi musik, daftar putar (*playlists*), album, dan artis tersimpan.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Kolom Pencarian Library | Mencari playlist/album dalam koleksi | Menyaring kartu koleksi sesuai kata kunci | ✅ Pass | Bekerja dengan baik |
| 2 | Sub-Tab: Playlists | Klik tab "Playlists" (default) | Menampilkan deretan kartu playlist buatan pengguna | ✅ Pass | Status aktif terpilih secara tepat |
| 3 | Sub-Tab: Albums | Klik tab "Albums" | Menampilkan daftar album musik yang disimpan | ✅ Pass | Berpindah tab dengan lancar |
| 4 | Sub-Tab: Artists | Klik tab "Artists" | Menampilkan daftar artis yang diikuti pengguna | ✅ Pass | Berpindah tab dengan lancar |
| 5 | Kartu Playlist Musik | Klik salah satu kartu dalam daftar playlist | Membuka detail playlist dalam mode imersif tersendiri | ✅ Pass | Menampilkan daftar lagu lengkap di playlist |

---

### 3.6. Halaman Favorit (Favorites)

Halaman kurasi khusus lagu-lagu yang telah ditandai hati oleh pengguna.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Kolom Pencarian Favorites | Mengetik judul lagu favorit | Memfilter daftar trek lagu favorit secara instan | ✅ Pass | Pencarian lokal bekerja cepat |
| 2 | Daftar Your Favorite Tracks | Memutar dan mengelola daftar lagu favorit | Lagu dapat diputar langsung dan ikon status aktif | ✅ Pass | Terintegrasi langsung dengan player |

---

### 3.7. Halaman Profil (Profile)

Manajemen identitas pengguna, statistik aktivitas mendengarkan musik, dan konfigurasi audio lanjutan.

| No | Komponen / Item Uji | Skenario Pengujian | Hasil yang Diharapkan | Status | Catatan / Temuan |
| :-: | ------------------- | ------------------ | --------------------- | :----: | ---------------- |
| 1 | Kolom Pencarian Profile | Mengetik pada bilah pencarian profil | Mencari riwayat/pengaturan profil | ❌ Fail | Kolom pencarian tidak aktif/tidak tersedia |
| 2 | Kartu Profil & Banner | Verifikasi info nama, bio, dan foto profil | Menampilkan data profil pengguna secara jelas | ✅ Pass | Tata letak banner dan foto presisi |
| 3 | Tombol Aksi: Edit Profile | Klik tombol "Edit Profile" | Memunculkan jendela pop-up modal edit profil | ✅ Pass | Modal terbuka dengan animasi halus |
| 4 | Tombol Aksi: Share Profile | Klik ikon bagikan (*share*) | Menyalin tautan profil ke clipboard atau modal share | ✅ Pass | Berfungsi sesuai harapan |
| 5 | Modal: Select Avatar | Memilih avatar dari 4 pilihan yang tersedia | Avatar terpilih berganti secara visual | ✅ Pass | Seleksi avatar responsif |
| 6 | Modal: Display Name & Bio | Mengubah input teks nama dan bio pengguna | Nilai form dapat diubah tanpa kendala | ✅ Pass | Form input responsif |
| 7 | Modal: Tombol Cancel & Close (X) | Klik tombol Cancel atau ikon silang (X) | Menutup pop-up tanpa menyimpan perubahan | ✅ Pass | Modal tertutup sempurna |
| 8 | Modal: Tombol Save Changes | Klik tombol "Save Changes" | Menyimpan data profil baru ke state/database | ✅ Pass | Data terbarui seketika |
| 9 | Statistik: Favorite Tracks | Tampilan jumlah lagu favorit | Menghitung total lagu disukai secara dinamis | ✅ Pass | Sinkron dengan database/state |
| 10 | Statistik: Playlists | Tampilan total playlist buatan | Menampilkan jumlah playlist aktif | ✅ Pass | Sinkron dengan daftar koleksi |
| 11 | Statistik: Listening Time | Tampilan metrik total jam mendengar | Menghitung durasi pemutaran riil | ❌ Fail | Nilai masih statis / belum kalkulasi dinamis |
| 12 | Statistik: Listener Rank | Tampilan badge tingkatan pendengar | Menampilkan peringkat (e.g. Pro Hi-Fi Member) | ✅ Pass | Tampil dengan desain badge elegan |
| 13 | Sub-Menu Profil: Overview | Klik tab internal "Overview" | Menampilkan ringkasan Top Favorites, Artists, & Playlists | ✅ Pass | Menampilkan 3 kartu grup aktivitas |
| 14 | Overview: Klik Artis Populer | Klik salah satu artis di Most Listened Artists | Membuka mode imersif detail artis | ✅ Pass | Tampilan imersif ter-render |
| 15 | Overview: Klik Playlist | Klik salah satu Created Playlists | Membuka mode imersif detail playlist | ✅ Pass | Tampilan imersif ter-render |
| 16 | Sub-Menu Profil: Saved Music | Klik tab "Saved Music" | Menampilkan daftar trek yang disimpan | ✅ Pass | Berjalan, namun isinya identik dengan menu Favorites |
| 17 | Sub-Menu: Audio & Settings | Klik tab "Audio & Settings" | Menampilkan konfigurasi audio dan preferensi | ✅ Pass | Form preferensi ter-render lengkap |
| 18 | Pengaturan: Audio Quality | Memilih opsi Streaming Audio Quality | Nilai kualitas audio (Hi-Fi, Lossless, dll.) berganti | ✅ Pass | Dropdown/radio dapat dipilih |
| 19 | Pengaturan: Hardware EQ | Memilih Hardware Equalizer Preset | Memilih preset EQ (Bass Boost, Vocal, Acoustic) | ✅ Pass | Seleksi preset bekerja |
| 20 | Preferensi: Crossfade Slider | Menggeser slider Crossfade Between Songs | Durasi transisi overlap lagu berubah (0–12 detik) | ✅ Pass | Nilai slider ter-update *real-time* |
| 21 | Preferensi: Loudness Normalization | Klik tombol toggle switch normalisasi audio | Sakelar berpindah status on/off | ✅ Pass | Toggle switch responsif |
| 22 | Preferensi: Autoplay Similar Music | Klik tombol toggle switch pemutaran otomatis | Sakelar berpindah status on/off | ✅ Pass | Toggle switch responsif |

---

## 4. Evaluasi Pengujian (Evaluation)

Berdasarkan hasil pengujian fungsional dan peninjauan pengalaman pengguna (*user experience*), ditemukan beberapa poin evaluasi utama:

1. **Inkonsistensi Alur Menu & Redundansi Navigasi**:  
   Halaman navigasi utama **Favorites** dan sub-menu **Saved Music** di dalam profil memiliki fungsi dan menampilkan konten yang hampir sama persis (menampilkan 3 lagu yang sama). Hal ini membuat struktur aplikasi terasa mubazir (*redundant*) dan membingungkan pengguna mengenai di mana mereka harus mengelola lagu simpanan mereka.

2. **Kontrol Player Kurang Fleksibel & Keterbatasan Ikon**:  
   Pada mode pemutar biasa (*Bottom Player*), tombol lirik atau antrean lagu (*queue*) memiliki ikon yang kurang kontras atau tidak terlihat jelas statusnya. Hal ini berisiko menyulitkan pengguna yang ingin mengatur urutan lagu berikutnya secara cepat tanpa harus membuka mode layar penuh.

3. **Kurangnya Personalisasi Visual pada Modul Profil**:  
   Fitur *Edit Profile* saat ini hanya menyediakan 4 pilihan avatar ilustrasi bawaan yang sangat terbatas. Pengguna modern mengharapkan kebebasan kustomisasi visual dengan mengunggah foto profil mandiri langsung dari galeri atau berkas lokal mereka.

4. **Ketergantungan Perangkat Keras (*Hardware Equalizer*)**:  
   Fitur *Hardware Equalizer Preset* sangat bergantung pada karakteristik perangkat output suara fisik (headphone, TWS, atau speaker eksternal). Tanpa adanya sistem deteksi otomatis tipe perangkat yang terhubung, preset manual berisiko menghasilkan keluaran audio yang kurang optimal atau tidak akurat.

---

## 5. Perubahan & Perbaikan yang Diperlukan (Required Changes)

Berikut adalah daftar perbaikan prioritas tinggi (*high priority fixes*) yang wajib diselesaikan oleh tim pengembang:

* [ ] **Sinkronisasi Tab Konten & Eliminasi Redundansi**:  
  Hapus sub-menu *Saved Music* pada halaman Profil, atau ubah fungsinya secara spesifik untuk menampilkan daftar lagu yang diunduh secara luring (*Offline Downloads*), sehingga memiliki diferensiasi nilai yang jelas dengan menu *Favorites*.
* [ ] **Penyempurnaan Animasi Transisi (Reverse Motion)**:  
  Implementasikan logika animasi berkebalikan (*reverse animation direction*). Saat pengguna menekan tombol *Previous*, animasi geser kartu lagu harus bergerak mundur ke kiri/arah berlawanan dibanding saat menekan tombol *Next*, serta berikan transisi *fade-in/fade-out* visual yang halus saat beralih masuk dan keluar dari mode Full Screen.
* [ ] **Fitur Custom Avatar Upload**:  
  Tingkatkan modul *Select Avatar* pada jendela pop-up *Edit Profile* dengan menambahkan tombol aksi **"Upload Custom Photo"** (mendukung format `.jpg`, `.png`, `.webp`) selain 4 avatar bawaan yang ada.
* [ ] **Visualizer Status Pemutaran Aktif pada Lagu**:  
  Pada baris daftar lagu (*Song List*), sematkan animasi bar audio mikro (*mini audio equalizer waves*) yang bergerak aktif di samping judul lagu yang sedang berputar (seperti contoh pada trek *Luminous*), agar pengguna dapat langsung mengenali lagu mana yang sedang aktif tanpa harus selalu melirik *bottom player*.
* [ ] **Fungsionalitas Tombol Kontrol yang Belum Beroperasi**:  
  * Implementasikan logika pengacakan (*Fisher-Yates shuffle*) pada tombol **Shuffle**.
  * Hubungkan siklus pengulangan (Repeat Off -> Repeat All -> Repeat One) pada tombol **Repeat**.
  * Berikan aksi pop-up menu (*context menu*) pada tombol **tiga titik** di baris lagu (opsi: *Play Next*, *Add to Playlist*, *Copy Share Link*).
  * Fungsikan tombol **Play** di tengah banner *Featured Chart* pada halaman Discover agar langsung memutar album/lagu unggulan tersebut.
  * Hubungkan tautan **See all** pada genre untuk menampilkan seluruh katalog genre musik.
  * Aktifkan kolom pencarian di halaman **Discover** dan **Profile**.
  * Sambungkan penghitung durasi riil ke metrik kartu statistik **Listening Time** di halaman Profil.

---

## 6. Ide & Usulan Pengembangan (Improvement Ideas)

Daftar inovasi fitur untuk pengembangan fase lanjutan (*future roadmap*) guna meningkatkan daya saing aplikasi MeloSync:

1. **AI Mood & Activity Generator**:  
   Kembangkan kolom pencarian pintar di menu *Discover* berbasis pemrosesan bahasa alami (NLP/LLM). Pengguna tidak hanya memilih kategori statis, melainkan dapat mengetik perintah bebas seperti: *"Buatkan playlist untuk coding larut malam saat hujan gerimis"*, dan AI akan secara otomatis meracik daftar putar yang paling relevan.

2. **Social Jamming (MeloRoom)**:  
   Pada halaman Profile, pengguna berstatus *Pro Hi-Fi Member* dapat membuat ruang dengar bersama secara langsung (*live listening room*). Teman atau pengikut dapat bergabung secara *real-time*, mendengarkan musik yang sama tanpa jeda, serta mengobrol di ruang diskusi mini.

3. **Offline Download Mode**:  
   Menimbang tersedianya pengaturan mutu audio tinggi (*Hi-Res Lossless*) yang mengonsumsi bandwidth internet besar, sediakan fitur unduh berkas audio ke IndexedDB/penyimpanan lokal peramban agar pengguna dapat menikmati musik tanpa sambungan internet.

4. **Smart Lyrics Translation**:  
   Integrasikan fitur penerjemahan lirik otomatis multi-bahasa secara berdampingan (*dual-lyrics mode*) saat lagu berbahasa asing (Inggris, Jepang, Korea, dsb.) diputar.

5. **Sleep Timer (Pengatur Waktu Tidur Otomatis)**:  
   Banyak pengguna memutar musik pada kategori *Late Night* atau *Deep Chill* menjelang tidur. Fitur pengatur waktu otomatis (misal: 15, 30, 45, 60 menit atau di akhir lagu yang sedang berjalan) sangat esensial agar pemutaran berhenti dengan redup (*fade out*) saat pengguna terlelap.

6. **MeloConnect (Cross-Device Switching)**:  
   Kemampuan mengontrol pemutaran musik antar-perangkat secara nirkabel melalui WebSocket/Supabase Realtime. Sebagai contoh, musik berputar pada speaker desktop/PC, tetapi pengguna dapat mengganti lagu dan mengatur volume menggunakan ponsel pintar sebagai *remote control*.

7. **Smart Device Integration**:  
   Dukungan integrasi ke ekosistem periferal pintar: *Smartwatch media controller*, dasbor *Android Auto / Apple CarPlay*, serta perintah suara *smart home* (Google Nest / Alexa).

8. **Collaborative Playlist**:  
   Pada menu *Library*, berikan kemampuan kepada pengguna untuk membuat daftar putar kolaboratif bersama teman. Setiap pengguna yang diundang dapat menambah, menghapus, atau menata urutan lagu secara bersamaan.

9. **Music Sharing Stories**:  
   Tombol *Share* yang langsung merender kartu visual estetik berlatar gradien album dinamis beserta kutipan lirik lagu bergerak, siap diekspor ke format rasio 9:16 untuk Instagram Stories, WhatsApp Status, atau TikTok.

10. **Focus Timer (Pomodoro Integration)**:  
    Pada sub-tab filter *Focus* atau *Coding & Concentration*, sediakan *timer* Pomodoro bawaan (25 menit sesi fokus, 5 menit istirahat). Lagu akan secara cerdas beralih dari musik berdenyut konsentrasi (*lo-fi/binaural*) ke instrumen rileks saat fase istirahat tiba.

11. **Visualizer Theme Selector**:  
    Saat pengguna beralih ke mode *Full Screen*, berikan panel opsi pemilih tema visualizer audio dinamis yang responsif terhadap frekuensi audio (bass, mid, treble), seperti tema *Retro 80s Arcade*, *Cyberpunk Neon City Grid*, atau *Minimalist Fluid Wave*.
