/* ===== Helper umum ===== */
const $ = (s, p = document) => p.querySelector(s);
const rp = n => 'Rp ' + Number(n).toLocaleString('id-ID');
const angka = s => parseInt(String(s).replace(/\D/g, ''), 10) || 0;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const simpan = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const ambil = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
const S = Swal.mixin({ confirmButtonColor: '#12263f', cancelButtonColor: '#8a97a8', customClass: { popup: 'swal-ut' } });
const Toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2200, timerProgressBar: true });
const FOTO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='46' height='62'%3E%3Crect width='46' height='62' fill='%2312263f'/%3E%3Ctext x='23' y='36' fill='%23f4a300' font-size='20' text-anchor='middle'%3E%F0%9F%93%96%3C/text%3E%3C/svg%3E";
function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  Object.assign(e, props);
  kids.forEach(k => e.append(k));
  return e;
}
const user = () => JSON.parse(sessionStorage.getItem('user') || 'null');

/* Gabungkan data dummy dengan data tambahan dari localStorage */
dataPengguna.push(...ambil('userBaru', []));
dataKatalogBuku.push(...ambil('stokBaru', []));
const semuaPesanan = () => ambil('pesanan', []);

/* ===== Navbar + guard login ===== */
function initNav(halaman) {
  const u = user();
  if (!u) { location.replace('index.html'); return false; }
  const link = [['dashboard', 'Dashboard'], ['stok', 'Katalog'], ['checkout', 'Pemesanan'], ['tracking', 'Tracking'], ['riwayat', 'Riwayat']];
  $('#topbar').innerHTML = `<a class="brand" href="dashboard.html"><i>UT</i> Pustaka UT</a>
    <nav aria-label="Navigasi">${link.map(([h, t]) => `<a href="${h === 'dashboard' ? 'dashboard' : h}.html" class="${h === halaman ? 'on' : ''}">${t}</a>`).join('')}</nav>
    <div class="who"><span>${esc(u.nama)} (${esc(u.role)})</span><button id="btnKeluar">Keluar</button></div>`;
  $('#btnKeluar').onclick = () => S.fire({ title: 'Keluar dari akun?', icon: 'question', showCancelButton: true, confirmButtonText: 'Ya, keluar', cancelButtonText: 'Batal' })
    .then(r => { if (r.isConfirmed) { sessionStorage.removeItem('user'); location.href = 'index.html'; } });
  return true;
}

/* ===== Login ===== */
function initLogin() {
  if (user()) { location.replace('dashboard.html'); return; }
  $('#formLogin').addEventListener('submit', e => {
    e.preventDefault();
    const email = $('#email').value.trim().toLowerCase(), pw = $('#password').value;
    if (!email || !pw) return S.fire({ icon: 'warning', title: 'Form belum lengkap', text: 'Email dan password wajib diisi.' });
    const u = dataPengguna.find(x => x.email.toLowerCase() === email && x.password === pw);
    if (!u) return S.fire({ icon: 'error', title: 'Login gagal', text: 'Email/password yang anda masukkan salah' });
    sessionStorage.setItem('user', JSON.stringify(u));
    S.fire({ icon: 'success', title: 'Selamat datang, ' + u.nama + '!', timer: 1600, showConfirmButton: false, timerProgressBar: true })
      .then(() => location.href = 'dashboard.html');
  });
  $('#btnLupa').onclick = () => S.fire({
    title: 'Lupa password?', input: 'email', inputLabel: 'Masukkan email yang terdaftar',
    inputPlaceholder: 'nama@gmail.com', showCancelButton: true, confirmButtonText: 'Kirim tautan reset', cancelButtonText: 'Batal',
    inputValidator: v => !v ? 'Email wajib diisi' : null
  }).then(r => {
    if (!r.isConfirmed) return;
    const ada = dataPengguna.some(x => x.email.toLowerCase() === r.value.trim().toLowerCase());
    ada ? S.fire({ icon: 'success', title: 'Tautan terkirim', text: 'Cek inbox ' + r.value + ' untuk mengatur ulang password.' })
        : S.fire({ icon: 'error', title: 'Email tidak ditemukan', text: 'Periksa lagi penulisan emailmu atau daftar akun baru.' });
  });
  $('#btnDaftar').onclick = () => S.fire({
    title: 'Daftar akun baru', showCancelButton: true, confirmButtonText: 'Daftar', cancelButtonText: 'Batal',
    html: `<input id="rNama" class="swal2-input" placeholder="Nama lengkap"><input id="rEmail" class="swal2-input" type="email" placeholder="Email"><input id="rPw" class="swal2-input" type="password" placeholder="Password (min. 6 karakter)">`,
    preConfirm: () => {
      const nama = $('#rNama').value.trim(), email = $('#rEmail').value.trim().toLowerCase(), password = $('#rPw').value;
      if (!nama || !email || !password) return Swal.showValidationMessage('Semua kolom wajib diisi');
      if (!/^\S+@\S+\.\S+$/.test(email)) return Swal.showValidationMessage('Format email tidak valid');
      if (password.length < 6) return Swal.showValidationMessage('Password minimal 6 karakter');
      if (dataPengguna.some(x => x.email.toLowerCase() === email)) return Swal.showValidationMessage('Email sudah terdaftar');
      return { nama, email, password };
    }
  }).then(r => {
    if (!r.isConfirmed) return;
    const baru = { id: dataPengguna.length + 1, ...r.value, role: 'User' };
    dataPengguna.push(baru);
    simpan('userBaru', [...ambil('userBaru', []), baru]);
    $('#email').value = baru.email;
    S.fire({ icon: 'success', title: 'Pendaftaran berhasil', text: 'Silakan login dengan akun barumu.' });
  });
}

/* ===== Dashboard ===== */
function initDashboard() {
  const u = user(), jam = new Date().getHours();
  const sapa = jam < 11 ? 'pagi' : jam < 15 ? 'siang' : jam < 18 ? 'sore' : 'malam';
  $('#sapa').textContent = `Selamat ${sapa}, ${u.nama.split(' ')[0]}!`;
  $('#tanggal').textContent = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('#stJudul').textContent = dataKatalogBuku.length;
  $('#stStok').textContent = dataKatalogBuku.reduce((t, b) => t + Number(b.stok), 0).toLocaleString('id-ID');
  $('#stPesan').textContent = semuaPesanan().filter(p => p.email === u.email).length;
  Toast.fire({ icon: 'info', title: 'Halo, ' + u.nama });
}

/* ===== Stok ===== */
function initStok() {
  const tbody = $('#tabelStok tbody');
  const baris = (b, baru) => {
    const tr = el('tr', { className: baru ? 'new' : '' });
    const img = el('img', { src: b.cover, alt: 'Cover ' + b.namaBarang }); img.onerror = () => { img.onerror = null; img.src = FOTO; };
    const low = b.stok < 200;
    const pesan = el('button', { className: 'btn sm', textContent: 'Pesan' });
    pesan.onclick = () => tambahKeranjang(b);
    tr.append(el('td', {}, img), el('td', { textContent: b.kodeBarang }), el('td', { innerHTML: `<b>${esc(b.namaBarang)}</b>` }),
      el('td', { textContent: b.jenisBarang }), el('td', { textContent: b.edisi }),
      el('td', { innerHTML: `<span class="tag ${low ? 'low' : ''}">${b.stok}</span>` }), el('td', { textContent: b.harga }), el('td', {}, pesan));
    return tr;
  };
  const render = () => {
    const q = $('#cari').value.toLowerCase();
    tbody.innerHTML = '';
    const hasil = dataKatalogBuku.filter(b => (b.kodeBarang + b.namaBarang).toLowerCase().includes(q));
    if (!hasil.length) tbody.innerHTML = '<tr><td colspan="8" class="empty">Buku tidak ditemukan. Coba kata kunci lain.</td></tr>';
    hasil.forEach(b => tbody.appendChild(baris(b)));
  };
  function tambahKeranjang(b) {
    const k = ambil('keranjang', []), ada = k.find(x => x.kode === b.kodeBarang);
    if ((ada ? ada.qty : 0) >= b.stok) return S.fire({ icon: 'warning', title: 'Stok tidak cukup' });
    ada ? ada.qty++ : k.push({ kode: b.kodeBarang, qty: 1 });
    simpan('keranjang', k);
    Toast.fire({ icon: 'success', title: b.namaBarang + ' masuk keranjang' });
  }
  $('#cari').oninput = render;
  $('#btnTambah').onclick = () => S.fire({
    title: 'Tambah stok baru', showCancelButton: true, confirmButtonText: 'Tambahkan', cancelButtonText: 'Batal',
    html: `<input id="nKode" class="swal2-input" placeholder="Kode barang (mis. EKMA4999)"><input id="nNama" class="swal2-input" placeholder="Nama barang">
      <input id="nEdisi" class="swal2-input" type="number" min="1" placeholder="Edisi"><input id="nStok" class="swal2-input" type="number" min="0" placeholder="Stok"><input id="nHarga" class="swal2-input" type="number" min="1000" placeholder="Harga (angka, mis. 175000)">`,
    preConfirm: () => {
      const v = id => $(id).value.trim();
      const kode = v('#nKode').toUpperCase(), nama = v('#nNama'), edisi = v('#nEdisi'), stok = v('#nStok'), harga = v('#nHarga');
      if (!kode || !nama || !edisi || stok === '' || !harga) return Swal.showValidationMessage('Semua kolom wajib diisi');
      if (dataKatalogBuku.some(b => b.kodeBarang === kode)) return Swal.showValidationMessage('Kode barang sudah ada');
      if (Number(stok) < 0 || Number(harga) <= 0) return Swal.showValidationMessage('Stok dan harga harus berupa angka positif');
      return { kodeBarang: kode, namaBarang: nama, jenisBarang: 'Buku Ajar', edisi, stok: Number(stok), harga: rp(harga), cover: '' };
    }
  }).then(r => {
    if (!r.isConfirmed) return;
    dataKatalogBuku.push(r.value);
    simpan('stokBaru', [...ambil('stokBaru', []), r.value]);
    $('#cari').value = ''; render();
    tbody.lastElementChild.classList.add('new');
    Toast.fire({ icon: 'success', title: 'Stok baru ditambahkan' });
  });
  render();
}

/* ===== Checkout ===== */
const ONGKIR = 15000;
function initCheckout() {
  const u = user(); $('#nama').value = u.nama; $('#emailP').value = u.email;
  const box = $('#keranjang');
  const draw = () => {
    let k = ambil('keranjang', []).filter(x => dataKatalogBuku.some(b => b.kodeBarang === x.kode));
    simpan('keranjang', k); box.innerHTML = '';
    if (!k.length) box.innerHTML = '<p class="empty">Keranjang masih kosong.<br>Pilih buku dulu di halaman Katalog.</p>';
    let sub = 0;
    k.forEach(x => {
      const b = dataKatalogBuku.find(y => y.kodeBarang === x.kode); sub += angka(b.harga) * x.qty;
      const img = el('img', { src: b.cover, alt: '' }); img.onerror = () => { img.onerror = null; img.src = FOTO; };
      const ubah = d => { x.qty += d; if (x.qty > b.stok) { x.qty = b.stok; Toast.fire({ icon: 'warning', title: 'Maksimal sesuai stok' }); } if (x.qty < 1) x.qty = 1; simpan('keranjang', k); draw(); };
      const min = el('button', { textContent: '−', type: 'button', ariaLabel: 'Kurangi' }), plus = el('button', { textContent: '+', type: 'button', ariaLabel: 'Tambah' });
      min.onclick = () => ubah(-1); plus.onclick = () => ubah(1);
      const hapus = el('button', { className: 'btn sm red', type: 'button', textContent: 'Hapus' });
      hapus.onclick = () => S.fire({ title: 'Hapus dari keranjang?', text: b.namaBarang, icon: 'warning', showCancelButton: true, confirmButtonColor: '#d64550', confirmButtonText: 'Hapus', cancelButtonText: 'Batal' })
        .then(r => { if (r.isConfirmed) { simpan('keranjang', k.filter(y => y !== x)); draw(); Toast.fire({ icon: 'success', title: 'Item dihapus' }); } });
      const info = el('div', { innerHTML: `<b>${esc(b.namaBarang)}</b><br><small>${esc(b.harga)}</small>` }, el('div', { className: 'qty' }, min, el('b', { textContent: x.qty }), plus));
      box.appendChild(el('div', { className: 'item' }, img, info, hapus));
    });
    const ong = k.length ? ONGKIR : 0;
    $('#sub').textContent = rp(sub); $('#ongkir').textContent = rp(ong); $('#total').textContent = rp(sub + ong);
  };
  $('#formPesan').addEventListener('submit', e => {
    e.preventDefault();
    const k = ambil('keranjang', []), v = id => $(id).value.trim();
    const err = !k.length ? 'Keranjang masih kosong.' : !v('#nama') ? 'Nama wajib diisi.' : !/^\S+@\S+\.\S+$/.test(v('#emailP')) ? 'Format email tidak valid.'
      : !/^(\+62|62|0)8\d{7,12}$/.test(v('#telp')) ? 'Nomor telepon tidak valid (contoh: 081234567890).' : v('#alamat').length < 10 ? 'Alamat minimal 10 karakter.'
      : !v('#bayar') ? 'Pilih metode pembayaran.' : '';
    if (err) return S.fire({ icon: 'error', title: 'Data belum benar', text: err });
    const total = $('#total').textContent;
    S.fire({ title: 'Konfirmasi pesanan', html: `Total <b>${total}</b> via ${esc(v('#bayar'))}.<br>Pesanan akan dikirim lewat ${esc(v('#ekspedisi'))}.`, icon: 'question', showCancelButton: true, confirmButtonText: 'Ya, pesan', cancelButtonText: 'Periksa lagi' })
      .then(r => {
        if (!r.isConfirmed) return;
        const now = new Date(), pad = n => String(n).padStart(2, '0');
        const wkt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        const nomorDO = String(Date.now()).slice(-8);
        const o = { nomorDO, nama: v('#nama'), email: u.email, status: 'Diproses', ekspedisi: v('#ekspedisi'), tanggalKirim: wkt.slice(0, 10), paket: 'REG' + nomorDO.slice(-4), total, pembayaran: v('#bayar'), alamat: v('#alamat'), perjalanan: [{ waktu: wkt, keterangan: 'Pesanan diterima dan sedang diproses gudang' }] };
        simpan('pesanan', [o, ...semuaPesanan()]); simpan('keranjang', []);
        S.fire({ icon: 'success', title: 'Pesanan berhasil!', html: `Nomor DO kamu: <b style="font-size:1.4rem">${nomorDO}</b>`, confirmButtonText: 'Lacak pesanan', showCancelButton: true, cancelButtonText: 'Tutup' })
          .then(x => { x.isConfirmed ? location.href = 'tracking.html?do=' + nomorDO : draw(); });
      });
  });
  draw();
}

/* ===== Tracking ===== */
function initTracking() {
  const hasil = $('#hasil'), input = $('#nomorDO');
  const cari = no => {
    const d = dataTracking[no] || semuaPesanan().find(p => p.nomorDO === no);
    if (!d) { hasil.innerHTML = ''; return S.fire({ icon: 'error', title: 'Nomor DO tidak ditemukan', text: 'Periksa kembali nomor Delivery Order: ' + no }); }
    const selesai = /^selesai/i.test(d.perjalanan[d.perjalanan.length - 1].keterangan);
    const tahap = ['Diproses', 'Dikirim', 'Dalam Perjalanan', 'Selesai'];
    const idx = selesai ? 3 : Math.max(0, tahap.indexOf(d.status));
    const warna = selesai ? '' : idx >= 2 ? 'amb' : '';
    hasil.innerHTML = `<div class="panel">
      <div class="status-top"><div><small>Nama pemesan</small><h2>${esc(d.nama)}</h2></div><span class="tag ${warna}">${selesai ? 'Terkirim' : esc(d.status)}</span></div>
      <div class="bar" role="progressbar" aria-valuenow="${(idx + 1) * 25}" aria-valuemin="0" aria-valuemax="100"><span style="width:0"></span></div>
      <div class="steps">${tahap.map((t, i) => `<span class="${i <= idx ? 'done' : ''}">${t}</span>`).join('')}</div>
      <div class="det"><div><small>Ekspedisi</small><b>${esc(d.ekspedisi)}</b></div><div><small>Tanggal kirim</small><b>${esc(d.tanggalKirim)}</b></div><div><small>Jenis paket</small><b>${esc(d.paket)}</b></div><div><small>Total pembayaran</small><b>${esc(d.total)}</b></div></div>
      <h3 style="margin-bottom:1rem">Riwayat perjalanan</h3>
      <ul class="tl">${[...d.perjalanan].reverse().map(p => `<li><time>${esc(p.waktu)}</time>${esc(p.keterangan)}</li>`).join('')}</ul></div>`;
    requestAnimationFrame(() => setTimeout(() => $('.bar span').style.width = (idx + 1) * 25 + '%', 50));
    Toast.fire({ icon: 'success', title: 'Pesanan ditemukan' });
  };
  $('#formCari').addEventListener('submit', e => {
    e.preventDefault();
    const no = input.value.trim();
    if (!no) return S.fire({ icon: 'warning', title: 'Nomor DO kosong', text: 'Masukkan Nomor Delivery Order dulu.' });
    cari(no);
  });
  const q = new URLSearchParams(location.search).get('do');
  if (q) { input.value = q; cari(q); }
}

/* ===== Riwayat ===== */
function initRiwayat() {
  const data = [...semuaPesanan(), ...Object.values(dataTracking)];
  const tb = $('#tabelRiwayat tbody');
  data.forEach(d => {
    const selesai = /^selesai/i.test(d.perjalanan[d.perjalanan.length - 1].keterangan);
    const a = el('a', { className: 'btn sm ghost', href: 'tracking.html?do=' + d.nomorDO, textContent: 'Lacak' });
    tb.appendChild(el('tr', {}, el('td', { textContent: d.nomorDO }), el('td', { textContent: d.tanggalKirim }), el('td', { textContent: d.nama }), el('td', { textContent: d.ekspedisi }), el('td', { textContent: d.total }),
      el('td', { innerHTML: `<span class="tag ${selesai ? '' : 'amb'}">${selesai ? 'Terkirim' : esc(d.status)}</span>` }), el('td', {}, a)));
  });
}

/* ===== Router sederhana ===== */
document.addEventListener('DOMContentLoaded', () => {
  const p = document.body.dataset.page;
  if (p === 'login') return initLogin();
  if (!initNav(p)) return;
  ({ dashboard: initDashboard, stok: initStok, checkout: initCheckout, tracking: initTracking, riwayat: initRiwayat })[p]();
});
