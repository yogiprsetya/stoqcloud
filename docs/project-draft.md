# StoqCloud — Draft Project Brief

## Purpose

StoqCloud adalah aplikasi web berbasis cloud untuk membantu bisnis mengelola gudang dan stok barang secara mudah, cepat, dan aman.

## Target user:

- Business Owner → butuh kontrol penuh & laporan stok.
- Warehouse Crew → fokus operasional harian (barang masuk/keluar).

## User Roles

### Owner (Admin)

- Manage SKU (CRUD)
- Kelola user & roles
- Lihat laporan dashboard
- Full access

### Crew (Operator)

- Input barang masuk (Stock In)
- Input barang keluar (Stock Out)
- Cek stok
- Tidak bisa hapus/ubah SKU

## Core Features

### SKU Management

- Tambah/edit/hapus SKU
- Field: kode, nama, kategori, supplier, harga pokok
- Upload batch via CSV/Excel
- Barcode generator (opsional)

### Stock In-Out

- Form Stock In (dengan nomor dokumen/PO)
- Form Stock Out (dengan nomor dokumen/SO)
- Update saldo stok otomatis
- Riwayat transaksi per SKU
- Notifikasi stok minimum

### Role-Based Auth (RBAC)

- JWT auth + role (Owner, Crew)
- Activity log (audit trail)

### Dashboard (Owner)

- Ringkasan stok total
- Stok menipis
- Barang keluar terbanyak
- Nilai persediaan

## Pages

- Login Page → redirect sesuai role
- Dashboard (Owner) → cards + chart ringkas
- SKU Management → tabel, search, filter, add SKU
- Stock In/Out → form input + riwayat transaksi
- User Management (Owner only) → add/reset user
