# Tugas UTS Pemrograman Web - MyBook's Store

## Identitas Mahasiswa
Nama : Muhammad Zacky Virgiano  
NIM : 312510349  
Kelas : I251B  
Mata Kuliah : Pemrograman Web

## Struktur File
```
tugas-uts-web1/
├── index.html        # Halaman login
├── dashboard.html    # Halaman utama setelah login
├── stok.html         # Informasi stok / katalog buku
├── checkout.html     # Pemesanan dan history transaksi
├── tracking.html     # Tracking pengiriman
├── css/style.css     # Seluruh tampilan (palet maroon, beige, cream, blue)
├── js/data.js        # Data awal: pengguna, katalog buku, tracking contoh
├── js/script.js      # Logika seluruh halaman
├── img/              # Cover buku
└── assets/           # Gambar halaman login
```

## Akun Bawaan   

| Email | Password | Role |
|-------|----------|------|
| rina@gmail.com | rina123 | User |
| agus@gmail.com | agus123 | User |
| siti@gmail.com | siti123 | Admin |


## Alur Halaman
```
index.html (Login) → dashboard.html → stok.html
                                    → checkout.html (Pemesanan + History)
                                    → tracking.html
```

## Penjelasan Per Halaman

### 1. Halaman Login (`index.html`)
Halaman awal website dengan tampilan dua kolom: kotak login di kiri dan ilustrasi buku di kanan, berlatar gambar bertema buku.

- **Form login:** pengguna mengisi email dan password. Data dicocokkan dengan daftar akun di `data.js` ditambah akun yang didaftarkan sendiri. Jika cocok, sesi login disimpan lalu pengguna diarahkan ke dashboard. Jika salah, muncul peringatan "email/password yang anda masukkan salah".
- **Lupa Password:** membuka jendela modal untuk memasukkan email. Jika kolom kosong, muncul peringatan bahwa email harus diisi. Jika terisi, muncul pesan bahwa petunjuk reset akan dikirim.
- **Daftar:** membuka modal pendaftaran dengan nama lengkap, email, dan password. Semua kolom wajib diisi dan email tidak boleh sudah terdaftar. Akun baru otomatis berperan sebagai `User` dan bisa langsung dipakai login.
- Tampilan menyesuaikan layar kecil (gambar samping disembunyikan pada layar sempit).   

<img width="1916" height="972" alt="image" src="https://github.com/user-attachments/assets/d209de57-c9c5-47c7-8e2e-1111bb2e39b0" />

### 2. Halaman Dashboard (`dashboard.html`)
Halaman utama setelah login.

- **Sapaan dinamis:** menampilkan "Selamat pagi/siang/sore/malam" sesuai jam saat ini, diikuti nama pengguna yang sedang login.
- **Tanggal hari ini:** ditampilkan dalam format Indonesia, misalnya hari, tanggal, bulan, dan tahun.
- **Menu utama** berupa empat kartu:
  - **Informasi Stok / Katalog**: menuju halaman katalog buku.
  - **Tracking Pengiriman**: menuju halaman pelacakan pesanan.
  - **Laporan Pemesanan**: menuju halaman pemesanan.
  - **History Transaksi**: menuju bagian riwayat pada halaman pemesanan.
- **Tombol Keluar:** menghapus data akun yang sedang login lalu kembali ke halaman login.   

<img width="1915" height="963" alt="image" src="https://github.com/user-attachments/assets/2bebcd27-9d02-4445-8290-11aa6a5bf02b" />


### 3. Halaman Informasi Stok / Katalog (`stok.html`)
Menampilkan daftar buku yang tersedia dalam bentuk tabel.

- **Tabel katalog:** kolom No, Cover, Kode, Nama Buku, Jenis, Edisi, Stok, dan Harga. Terdapat lima buku awal: Pengantar Ilmu Komunikasi, Manajemen Keuangan, Kepemimpinan, Mikrobiologi Dasar, dan Perkembangan Anak Usia Dini.
- **Tombol Pesan Buku** di bagian atas mengarahkan langsung ke halaman pemesanan.
- **Form Tambah Buku Baru:** pengguna mengisi kode barang, nama buku, jenis, edisi, jumlah stok, dan harga. Kode barang harus unik, jika sudah ada akan muncul peringatan. Harga otomatis diformat menjadi format rupiah (misalnya `Rp 150.000`). Buku baru langsung muncul di tabel dan juga tersedia pada pilihan di halaman pemesanan.   

<img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/691f3774-6377-46df-a91e-708822415e43" />
   
<img width="1917" height="957" alt="image" src="https://github.com/user-attachments/assets/7793a110-b269-4f46-adbb-e24d747dd5ba" />


### 4. Halaman Pemesanan dan History Transaksi (`checkout.html`)
Halaman untuk membuat pesanan, terdiri dari tiga bagian.

- **Daftar Pesanan:**
  - Pilih buku dari dropdown (berisi seluruh buku di katalog) dan isi jumlahnya, lalu klik **Tambah Buku**.
  - Jika buku yang sama ditambahkan lagi, jumlahnya digabung, bukan dibuat baris baru.
  - Jumlah pada tabel bisa diubah langsung (minimal 1) dan tombol **Hapus** menghapus buku dari pesanan.
  - Subtotal tiap buku serta **Total** harga dihitung otomatis.
- **Informasi Pemesan dan Pembayaran:** nama dan email terisi otomatis dari akun yang login. Pengguna mengisi alamat pengiriman dan memilih metode pembayaran (Transfer Bank, COD, atau E-Wallet). Saat **Buat Pesanan** diklik, sistem memastikan keranjang tidak kosong, membuat nomor Delivery Order baru (`DO1001`, `DO1002`, dan seterusnya), menampilkan nomor tersebut, lalu mengosongkan keranjang dan form.
- **History Transaksi:** tabel berisi No. DO, Nama, Total, dan metode Pembayaran dari setiap pesanan yang sudah dibuat.   

<img width="1917" height="963" alt="image" src="https://github.com/user-attachments/assets/9943fb0f-c547-4ac6-8a7b-5145f5d0371c" />
  
<img width="1917" height="965" alt="image" src="https://github.com/user-attachments/assets/a7aa726f-85fe-4522-96a6-d3aecbf06800" />



### 5. Halaman Tracking Pengiriman (`tracking.html`)
Halaman untuk melacak status pesanan berdasarkan nomor Delivery Order.

- **Form pencarian:** masukkan nomor DO lalu klik **Cari**. Nomor yang dapat dicoba:
  - `20230012`: atas nama Rina Wulandari, status *Dalam Perjalanan*, ekspedisi JNE.
  - `20230013`: atas nama Agus Pranoto, status *Dikirim*, ekspedisi Pos Indonesia.
  - Nomor DO dari pesanan yang dibuat sendiri (misalnya `DO1001`) dengan status *Pesanan Diproses*.
- **Hasil pencarian:** menampilkan nomor DO, nama pemesan, status beserta bar progres, ekspedisi, tanggal kirim, jenis paket, total pembayaran, dan **riwayat perjalanan** paket secara berurutan.
- **Nomor tidak ditemukan:** muncul pesan "Data tidak ditemukan" agar pengguna memeriksa kembali nomor DO.   

<img width="1917" height="912" alt="image" src="https://github.com/user-attachments/assets/f30eb932-0887-4909-8dd1-5050b1ae67e4" />
