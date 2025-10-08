## Rencana Fitur Selanjutnya

Dokumen ini merangkum rencana pengembangan fitur StoqCloud berdasarkan analisis OpenAPI saat ini. Fokus pada peningkatan visibilitas bisnis, efisiensi operasional, dan skalabilitas.

### Tujuan Produk

- **Visibilitas**: Menyediakan metrik kunci inventory dan performa transaksi.
- **Efisiensi**: Mempercepat proses operasional (import massal, filter lanjutan).
- **Kontrol & Kepatuhan**: Audit trail untuk perubahan data dan aktivitas pengguna.

### Ringkasan Fitur yang Sudah Ada

- Auth (NextAuth) dengan role MANAGER/STAFF.
- CRUD: `Category`, `Supplier`, `SKU`, `Users` (MANAGER only).
- Transaksi: `Stock In`, `Stock Out` (auto-update stok, validasi stok keluar).
- Dokumen unduh untuk transaksi (text file).
- Pagination, pencarian dasar, sorting.

---

### Roadmap dan Prioritas

#### High Priority (0–3 bulan)

1. Dashboard Analytics API
2. Stock & Transaction Reports
3. Low Stock Alerts
4. Bulk Import (SKU/Stock)

#### Medium Priority (3–6 bulan)

5. Advanced Search & Filtering
6. Audit Trail (data & aktivitas)
7. Data Export (CSV/Excel)

#### Low Priority (6–12 bulan)

8. Notification Center (in-app/email)
9. Barcode (generate/scan)
10. Inventory Cycle Count
11. Company Settings

---

### Detail Fitur yang Diusulkan (API-First)

#### 1) Dashboard Analytics

- Endpoint:
  - `GET /api/dashboard/overview` — total SKU, total nilai stok, jumlah supplier, jumlah kategori, jumlah pengguna aktif.
  - `GET /api/dashboard/transactions` — ringkasan transaksi 7/30 hari, grafik tren harian (IN/OUT), transaksi terakhir.
  - `GET /api/dashboard/performance` — top SKU (OUT), stok mendekati minimum, performa supplier (berdasarkan frekuensi transaksi IN).
- Security: `sessionAuth` (MANAGER & STAFF), beberapa metrik agregat mungkin MANAGER only.
- Non-fungsional: caching 60–300 detik, indeks DB untuk kolom waktu dan foreign key.

#### 2) Reporting System

- Endpoint:
  - `GET /api/reports/stock-summary?categoryId&supplierId` — level stok per SKU (+ nilai persediaan).
  - `GET /api/reports/transaction-history?type&from&to&skuId&supplierId&page` — riwayat transaksi dengan filter waktu.
  - `GET /api/reports/supplier-performance?from&to` — agregasi transaksi per supplier.
  - `GET /api/reports/low-stock?threshold` — daftar SKU di bawah ambang stok.
- Output: JSON; opsi `accept=text/csv` untuk export cepat (lihat bagian Export).

#### 3) Low Stock Alerts

- Endpoint:
  - `GET /api/alerts/low-stock?threshold` — read model untuk UI dan integrasi.
  - `POST /api/alerts/low-stock/test` — trigger uji (MANAGER only).
- Mekanisme: job terjadwal (cron/queue) memindai SKU dan membuat entri alert; opsional email/webhook.

#### 4) Bulk Operations

- Endpoint:
  - `POST /api/bulk/sku-import` — unggah CSV/Excel berisi SKU baru/perubahan dasar.
  - `POST /api/bulk/stock-in` — unggah batch transaksi stock in.
  - `POST /api/bulk/stock-adjustment` — penyesuaian stok massal (MANAGER only).
- Catatan: validasi baris, partial failure report, idempotency key.

#### 5) Advanced Search & Filtering

- Endpoint:
  - `GET /api/search/global?keyword` — cari `SKU`, `Supplier`, `Category` sekaligus.
  - `GET /api/sku/advanced-filter?categoryId&supplierId&minStock&maxStock&sortBy`.
  - `GET /api/transactions/advanced-filter?type&from&to&minQty&maxQty&skuId&supplierId`.
- Teknis: gunakan kombinasi indeks, limit, dan pagination konsisten.

#### 6) Audit Trail

- Endpoint:
  - `GET /api/audit/logs?entity&entityId&userId&from&to&page` — activity logs.
  - `GET /api/audit/changes?entity&entityId&page` — riwayat perubahan field-level.
  - `GET /api/audit/user-activity?userId&from&to` — aktivitas per pengguna.
- Scope: CRUD pada `SKU`, `Supplier`, `Category`, `Users`, transaksi `Stock In/Out`.

#### 7) Data Export/Import

- Endpoint:
  - `GET /api/export/stock-report?format=csv|xlsx` — export ringkasan stok.
  - `GET /api/export/transaction-report?type&from&to&format=csv|xlsx`.
  - `POST /api/import/supplier-data` — import supplier eksternal.
- Teknis: streaming untuk file besar, validasi dan sanitasi data.

#### 8) Notification System

- Endpoint:
  - `GET /api/notifications?page` — daftar notifikasi.
  - `POST /api/notifications/read` — tandai terbaca.
  - `POST /api/notifications/preferences` — preferensi pengguna (MANAGER/STAFF).
- Channel: in-app terlebih dahulu; email/webhook opsional.

#### 9) Barcode & Cycle Count (Opsional Lanjutan)

- Barcode: `POST /api/sku/{id}/barcode` (generate), `POST /api/sku/barcode/scan` (lookup).
- Cycle Count: `POST /api/inventory/cycle-count/start`, `PATCH /api/inventory/cycle-count/{id}` (tutup/rekonsiliasi).

---

### Konsiderasi Teknis

- Indeks database pada kolom: `createdAt`, `skuId`, `supplierId`, `categoryId`, serta komposit untuk filter umum.
- Caching layer untuk endpoint agregasi (dashboard, reports) dengan TTL pendek.
- Background jobs/queue untuk import besar, notifikasi, audit sink.
- Idempotency untuk endpoint bulk agar aman terhadap retry.
- Validasi skema input (zod/yup) dan konsistensi respons mengikuti `SuccessResponse`/`ErrorResponse`.
- Batasan ukuran file dan antivirus scan untuk unggahan.

### Pertimbangan Keamanan & Akses

- Role-based access: laporan lengkap, audit, dan bulk ops — MANAGER only.
- Redaksi data sensitif pada audit/export jika diperlukan.
- Rate limiting untuk endpoint pencarian dan export.

### Metrik Keberhasilan (KPIs)

- Waktu muat dashboard < 1.5s (p95) setelah cache hangat.
- Keberhasilan import bulk ≥ 98% baris valid, laporan error jelas.
- Penurunan stockout insiden ≥ 30% dalam 3 bulan setelah low stock alert.
- Waktu pencarian advanced < 500ms (p95) untuk 10k+ SKU.

### Risiko & Mitigasi

- Query mahal pada laporan: gunakan materialized view/denormalized read model jika perlu.
- Kualitas data import: sediakan template, validasi ketat, dan pratinjau sebelum commit.
- Kebocoran data via export: audit akses, URL bertanda tangan, kedaluwarsa singkat.

---

### Timeline Implementasi (Usulan)

- Sprint 1–2: Dashboard overview + laporan stok ringkas + indeks DB.
- Sprint 3–4: Transaction history report + low stock alerts + caching.
- Sprint 5–6: Bulk import SKU/Stock + advanced filtering.
- Sprint 7–8: Audit trail + export CSV/Excel + notifikasi in-app dasar.

### Lampiran

- Referensi OpenAPI saat ini: `docs/openapi.yaml`.
