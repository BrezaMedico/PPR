# Laporan Praktikum: Partial Prerendering (PPR) pada Dashboard Monitoring Sensor

**Kelompok:** Kelompok 6  
**Anggota:**  
- Rafarel Haidar Yastaqi  
- Maajid Pratama  
- Muhamad Nashiruddin Al Husaini  

**Repository:** `https://github.com/raf1992/ppr-dashboard`  
**Framework & Versi:** Next.js 16.4.0, React 19.3.0, Node.js v24.14.0  

---

## A. Ringkasan Implementasi

Praktikum ini berhasil mengimplementasikan dan membuktikan konsep **Partial Prerendering (PPR)** pada aplikasi Next.js 16:
1. **Static Shell (Prerendered at Build Time):**
   - `Header.tsx`: Nama dashboard dan status koneksi visual "Online".
   - `Hero Section`: Judul "Monitoring Sensor" dan deskripsi.
   - `SensorCards.tsx`: Ringkasan 4 sensor (Suhu, LDR, Jarak, Kelembapan) dengan grid responsif.
   - `Activity Section`: Log aktivitas sistem terbaru.
   - `Footer`: Identitas dashboard Next.js + PPR.
2. **Dynamic Holes (Streamed at Request Time):**
   - **Dynamic Hole 1 (`SensorData.tsx`):** Komponen async server component yang memanggil `await connection()`, menunggu proses async data sensor, menghasilkan pembacaan dinamis berbasis `Math.random()`, dibungkus dalam Suspense dengan skeleton fallback `Loading.tsx`.
   - **Dynamic Hole 2 (`DeviceStatus.tsx`):** Komponen dynamic boundary kedua yang memanggil `await connection()`, mengembalikan timestamp waktu request server (`toLocaleTimeString`) dan status gateway ESP32, dibungkus dalam boundary Suspense independen dengan fallback `DeviceStatusSkeleton.tsx`.
3. **Hasil Build:**
   - Route `/` berhasil terverifikasi dengan simbol **`◐` (Partial Prerender)**: static shell disajikan instan dari cache/edge, sedangkan bagian dinamis dikirimkan melalui HTTP chunked streaming saat request masuk.

---

## B. Tugas Pengembangan (Challenges)

### Challenge 1 — Penambahan Sensor Kelembapan
- **Perubahan:** Menambahkan kartu sensor `KELEMBAPAN` dengan nilai `62%`, ikon `💧`, dan deskripsi `Kelembapan udara` pada `app/components/SensorCards.tsx`. Layout grid disesuaikan menjadi responsif (`grid gap-5 sm:grid-cols-2 lg:grid-cols-4`).
- **Jawaban Pertanyaan Challenge 1:**  
  *Mengapa penambahan kartu ini tidak otomatis membuatnya menjadi dynamic hole?*  
  Karena data sensor pada `SensorCards.tsx` didefinisikan sebagai struktur data lokal statis murni tanpa membaca request-time data (seperti cookies, headers, searchParams, atau `connection()`) dan tidak dijalankan dalam async server component yang menunggu I/O pada runtime. Komponen ini dapat dievaluasi secara tuntas pada waktu build (prerender phase) dan menjadi bagian dari static shell.

### Challenge 2 — Ubah Spinner Menjadi Skeleton
- **Perubahan:** Mengganti loader spinner di `app/components/Loading.tsx` dengan kerangka 3 skeleton card (`animate-pulse`) yang memiliki dimensi, padding, dan struktur identik dengan komponen final `SensorData.tsx`.
- **Jawaban Pertanyaan Challenge 2:**  
  *Bagaimana dimensi fallback memengaruhi pengalaman pengguna dan potensi layout shift?*  
  Dimensi fallback yang presisi dan mendekati ukuran komponen akhir mencegah terjadinya pergeseran tata letak mendadak (Cumulative Layout Shift / CLS) saat data streaming selesai dimuat. Pengguna merasa antarmuka lebih stabil dan responsif karena ruang untuk konten sudah dipesan sebelumnya, berbeda dengan spinner kecil yang dapat menyebabkan konten di bawahnya terdorong ke bawah secara drastis saat data masuk.

### Challenge 3 — Buat Dynamic Boundary Kedua
- **Perubahan:** Membuat komponen `app/components/DeviceStatus.tsx` dan `app/components/DeviceStatusSkeleton.tsx` yang menggunakan `await connection()` dari `next/server` untuk menyajikan waktu request server aktual (`requestTime`) dan info node gateway. Di `app/page.tsx`, komponen dibungkus dengan boundary Suspense tersendiri.
- **Jawaban Pertanyaan Challenge 3:**  
  *Apa keuntungan memiliki dua Suspense boundary dibandingkan satu boundary besar?*  
  Dengan boundary Suspense terpisah, komponen yang selesai lebih cepat (misal `DeviceStatus` dalam 2 detik) dapat langsung di-stream dan dirender oleh browser tanpa harus tertahan menunggu komponen yang membutuhkan waktu lebih lama (`SensorData` dalam 5 detik). Hal ini memaksimalkan efisiensi progressive streaming dan membuat pengguna menerima informasi bertahap lebih awal.

### Challenge 4 — Nilai Sensor Berubah per Request
- **Perubahan:** Memodifikasi `getSensorData()` di `app/components/SensorData.tsx` dengan memanggil `await connection()` terlebih dahulu, kemudian menghitung nilai suhu, intensitas cahaya, dan jarak secara acak menggunakan `Math.random()`.
- **Jawaban Pertanyaan Challenge 4:**  
  *Mengapa nilai acak harus dibuat pada request time untuk eksperimen ini?*  
  Jika nilai acak dieksekusi saat prerender (build time), nilainya akan "beku" (statis) di dalam bundle HTML hasil build dan selalu bernilai sama setiap kali halaman dimuat oleh browser. Dengan meletakkannya setelah boundary `await connection()`, Next.js memastikan eksekusi terjadi pada saat request HTTP masuk, menghasilkan pembacaan baru di setiap reload browser.

### Challenge 5 — Bandingkan Fallback Kosong dan Tanpa Boundary
- **Analisis & Pembahasan:**
  1. **Suspense dengan `<Loading />` (Skeleton):** Static shell tampil seketika, area data menampilkan skeleton berkedip yang informatif, kemudian berganti secara mulus saat data selesai di-stream tanpa layout shift.
  2. **Suspense dengan `fallback={null}`:** Static shell tampil seketika, namun area data kosong tanpa indikasi pemrosesan (terkesan kosong/rusak) hingga data tiba-tiba muncul dan menyebabkan layout melompat.
  3. **Komponen Dinamis Tanpa Suspense Boundary:** Seluruh halaman akan dipaksa menjadi dynamic rendering (`ƒ Dynamic`) atau menyebabkan build error / warning karena uncached request-time work berada di luar Suspense, sehingga static shell gagal diprerender dan pengguna harus menunggu seluruh latensi data sebelum melihat tampilan apa pun (layar putih / TTFB tinggi).
- **Jawaban Pertanyaan Challenge 5:**  
  *Mengapa boundary Suspense diperlukan pada dynamic hole?*  
  React Suspense mendefinisikan batas isolasi antara bagian halaman yang sinkron/statis dengan bagian yang asinkron/tertunda. Boundary ini memungkinkan Next.js membekukan dan menyajikan static shell terlebih dahulu, sambil memberi tahu klien untuk menampilkan fallback sementara sampai aliran data server (server stream) siap dikirimkan.

---

## C. Jawaban Pertanyaan Pemahaman (Bagian I)

1. **Perbedaan Static Rendering, Dynamic Rendering, dan Partial Prerendering:**
   - *Static Rendering:* Seluruh rute di-render saat build time menjadi HTML statis. Sangat cepat (TTFB rendah), namun tidak dapat memuat data dinamis per-request.
   - *Dynamic Rendering:* Seluruh rute di-render di server saat request masuk. Fleksibel untuk data real-time, tetapi TTFB tinggi karena pengguna harus menunggu semua proses server selesai sebelum menerima respons pertama.
   - *Partial Prerendering (PPR):* Kombinasi terbaik dari keduanya dalam satu rute. Bagian statis (shell) di-prerender saat build time dan dikirim instan, sedangkan bagian dinamis (hole) diselesaikan saat request time dan di-stream secara paralel melalui React Suspense.

2. **Arti static shell dan dynamic hole dalam PPR:**
   - *Static Shell:* Bagian halaman (tata letak, header, navigasi, teks statis, kartu statis) yang tidak bergantung pada data dinamis request dan dapat dibuat sebelum request masuk.
   - *Dynamic Hole:* Titik atau blok spesifik dalam UI (subtree di dalam `<Suspense>`) yang membutuhkan data request-time (seperti cookies, headers, sensor data dinamis) dan diisi setelah request diterima server melalui HTTP streaming.

3. **Pentingnya `cacheComponents: true` pada Next.js 16:**
   - `cacheComponents: true` mengaktifkan model komputasi komponen berbasis cache di Next.js 16. Opsi ini menjadi fondasi arsitektur PPR di Next.js 16 yang memisahkan bagian yang dapat dicache/diprerender secara deterministik dari bagian uncached yang memerlukan runtime request.

4. **Perbedaan fungsi `cacheComponents` dan `partialPrefetching`:**
   - `cacheComponents`: Mengatur model rendering dan caching komponen di level server/compiler.
   - `partialPrefetching`: Fitur navigasi klien di mana Next.js melakukan prefetch hanya untuk bagian static shell rute tujuan saat pengguna mendekati link navigasi, mengurangi beban jaringan dan mempercepat perpindahan halaman.

5. **Fungsi Suspense dan peran fallback:**
   - Suspense bertindak sebagai batas penanganan asinkron (async boundary).
   - Fallback adalah representasi visual sementara (seperti skeleton atau spinner) yang langsung ditampilkan ke pengguna selama konten utama di dalam Suspense masih dalam status pending/loading di server.

6. **Mengapa komponen async belum tentu otomatis menjadi request-time hanya karena menggunakan `setTimeout`?**
   - Tanpa adanya Dynamic API atau pemanggilan `connection()`, Next.js saat proses build dapat menunggu Promise `setTimeout` hingga selesai (jika batas waktu build mencukupi) dan memasukkan hasilnya ke dalam static prerender. Suatu komponen hanya menjadi request-time sejati jika ia mengakses informasi request atau dideklarasikan secara eksplisit membutuhkan koneksi request klien.

7. **Peran `connection()` saat hasil render harus menunggu request masuk:**
   - Fungsi `connection()` dari `next/server` secara eksplisit memberitahukan Next.js Compiler dan Turbopack bahwa komponen atau fungsi tersebut tidak boleh dievaluasi saat build prerender, melainkan wajib ditangguhkan (postponed) hingga sebuah request HTTP nyata dari klien diterima server.

8. **Mengapa pengujian production build perlu dilakukan selain `npm run dev`?**
   - Di mode development (`npm run dev`), Next.js menjalankan kompilasi on-demand per request dan menonaktifkan beberapa optimasi produksi serta perilaku caching penuh untuk memudahkan debugging. Pengujian build (`npm run build`) dan production server (`npm start`) diperlukan untuk memverifikasi tabel rute rilis, simbol PPR (`◐`), pembentukan chunk statis, dan perilaku streaming asli.

9. **Arti simbol `◐`, `○`, dan `ƒ` pada tabel route Next.js:**
   - `○ (Static)`: Rute sepenuhnya diprerender sebagai file HTML statis saat build time.
   - `◐ (Partial Prerender)`: Rute hybrid PPR; static shell tersedia instan dan konten dinamis di-stream saat request.
   - `ƒ (Dynamic)`: Seluruh rute dirender dari awal di server saat ada request (server-rendered on demand).

10. **Mengapa data pada repository ini tidak boleh disebut data sensor real-time dari perangkat fisik?**
    - Karena data dihasilkan oleh simulasi kode lokal (`setTimeout` dan nilai buatan/`Math.random`), tidak terhubung ke hardware controller (Arduino, ESP32, Raspberry Pi) melalui protokol IoT (MQTT, WebSockets, REST API sensor), dan tidak membaca sensor fisik sebenarnya di lingkungan nyata.

11. **Risiko fallback yang dimensinya jauh lebih kecil daripada konten akhir:**
    - Menyebabkan pergeseran tata letak kumulatif yang besar (Cumulative Layout Shift / CLS tinggi). Ketika konten akhir selesai dimuat dan menggantikan fallback kecil, elemen-elemen di bawahnya akan mendadak terdorong ke bawah, merusak estetika dan membingungkan interaksi pengguna.

12. **Apakah PPR otomatis menjamin CLS nol atau TTFB selalu sama dengan static site?**
    - Tidak otomatis. TTFB static shell bisa sedikit dipengaruhi oleh latensi edge caching/server handshake, meskipun secara umum mendekati static site. Sementara itu, CLS nol hanya tercapai jika developer merancang fallback skeleton dengan ukuran (aspek rasio dan tinggi/lebar) yang presisi menyerupai komponen akhir. Jika fallback tidak didesain dengan baik, CLS tetap dapat terjadi.

---

## D. Kesimpulan dan Refleksi (Bagian J)

> Melalui praktikum ini, kami memahami bahwa Partial Prerendering (PPR) adalah paradigma modern pada Next.js yang memadukan kecepatan waktu muat situs statis dengan fleksibilitas data real-time dinamis dalam satu rute tunggal. Pada dashboard IoT ini, komponen Header, Hero, SensorCards, Aktivitas, dan Footer berfungsi sebagai *static shell* yang disajikan secara instan, sementara SensorData dan DeviceStatus berperan sebagai *dynamic hole* yang dialirkan melalui React Suspense dan HTTP chunked streaming. Bukti pengujian paling meyakinkan terlihat pada simbol rute `◐` pada output `npm run build` serta response headers `x-nextjs-prerender: 1` dan `x-nextjs-postponed: 1` pada server produksi. Kendala berupa komponen async yang berpotensi dianggap statis berhasil diatasi secara andal menggunakan `await connection()` dari `next/server`. Arsitektur PPR ini sangat ideal diterapkan pada aplikasi dunia nyata seperti e-commerce (shell produk statis dengan harga/stok dinamis), dashboard analitik, dan portal berita personalisasi.

---

## E. Verifikasi Production Build & Runtime Output

### 1. Output `npm run build`:
```text
▲ Next.js 16.4.0 (Turbopack)
- Cache Components enabled
- Partial Prefetching enabled
- Experiments: agentFeedback

Route (app)
┌ ◐ /
└ ○ /_not-found

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

### 2. Output HTTP Response Headers (`curl.exe -i http://localhost:3000`):
```http
HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-stale-time: 300
x-nextjs-prerender: 1
x-nextjs-postponed: 1
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
```
*Terbukti bahwa static shell dan fallback skeleton dikirimkan di awal koneksi, diikuti oleh streaming chunk dynamic hole 1 dan dynamic hole 2.*

