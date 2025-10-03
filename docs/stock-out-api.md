# Stock Out API Documentation

API untuk mengelola transaksi stock-out (barang keluar) dalam sistem StoqCloud menggunakan endpoint `/api/stock` dengan parameter `type=OUT`.

## Base URL

```
/api/stock
```

## Authentication

Semua endpoint memerlukan authentication. Gunakan session cookie atau JWT token.

## Endpoints

### 1. GET /api/stock?type=OUT

Mengambil daftar transaksi stock-out dengan pagination.

**Query Parameters:**

- `type=OUT`: Filter untuk transaksi stock-out
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah item per halaman (default: 10)
- `keyword` (optional): Pencarian berdasarkan nama SKU
- `sort` (optional): Urutan (asc/desc, default: desc)
- `sortBy` (optional): Field untuk sorting (createdAt/documentNumber, default: createdAt)

**Response:**

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "skuId": "uuid",
        "type": "OUT",
        "quantity": 50,
        "unitPrice": "15000.00",
        "totalPrice": "750000.00",
        "documentNumber": "SO-2024-001",
        "notes": "Stock out for sales",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "sku": {
          "id": "uuid",
          "skuCode": "SKU001",
          "name": "Product A",
          "categoryName": "Category A",
          "supplierName": "Supplier A"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 2. POST /api/stock

Membuat transaksi stock-out baru.

**Request Body:**

```json
{
  "skuId": "uuid",
  "type": "OUT",
  "quantity": 50,
  "unitPrice": 15000,
  "totalPrice": 750000,
  "documentNumber": "SO-2024-001",
  "notes": "Stock out for sales"
}
```

**Validation Rules:**

- `skuId`: Required, harus berupa UUID yang valid
- `type`: Required, harus "OUT" untuk stock-out
- `quantity`: Required, harus lebih dari 0
- `unitPrice`: Required, tidak boleh negatif
- `totalPrice`: Required, tidak boleh negatif
- `documentNumber`: Optional, string
- `notes`: Optional, string

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "OUT",
    "quantity": 50,
    "unitPrice": "15000.00",
    "totalPrice": "750000.00",
    "documentNumber": "SO-2024-001",
    "notes": "Stock out for sales",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. GET /api/stock/[id]

Mengambil detail transaksi stock-out berdasarkan ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "OUT",
    "quantity": 50,
    "unitPrice": "15000.00",
    "totalPrice": "750000.00",
    "documentNumber": "SO-2024-001",
    "notes": "Stock out for sales",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "sku": {
      "id": "uuid",
      "skuCode": "SKU001",
      "name": "Product A",
      "categoryName": "Category A",
      "supplierName": "Supplier A"
    }
  }
}
```

### 4. PATCH /api/stock/[id]

Update transaksi stock-out.

**Request Body:**

```json
{
  "quantity": 75,
  "unitPrice": 16000,
  "totalPrice": 1200000,
  "documentNumber": "SO-2024-001-REV",
  "notes": "Updated quantity"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "OUT",
    "quantity": 75,
    "unitPrice": "16000.00",
    "totalPrice": "1200000.00",
    "documentNumber": "SO-2024-001-REV",
    "notes": "Updated quantity",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. DELETE /api/stock/[id]

Hapus transaksi stock-out.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "OUT",
    "quantity": 50,
    "unitPrice": "15000.00",
    "totalPrice": "750000.00",
    "documentNumber": "SO-2024-001",
    "notes": "Stock out for sales",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Features

### Automatic Stock Update

- Ketika stock-out dibuat, quantity SKU akan otomatis berkurang
- Ketika stock-out diupdate, quantity SKU akan disesuaikan dengan selisih
- Ketika stock-out dihapus, quantity SKU akan dikembalikan (ditambah)

### Stock Validation

- Sistem akan memvalidasi ketersediaan stok sebelum membuat stock-out
- Jika stok tidak mencukupi, akan mengembalikan error dengan pesan yang jelas
- Update quantity juga akan memvalidasi ketersediaan stok

### Transaction Safety

- Semua operasi menggunakan database transaction untuk memastikan konsistensi data
- Jika terjadi error, semua perubahan akan di-rollback

### Error Handling

**Insufficient Stock Error:**

```json
{
  "success": false,
  "error": "Insufficient stock. Available: 30, Requested: 50"
}
```

**SKU Not Found Error:**

```json
{
  "success": false,
  "error": "SKU not found"
}
```

**Transaction Not Found Error:**

```json
{
  "success": false,
  "error": "Stock transaction not found"
}
```

## Business Rules

1. **Stock Validation**: Sistem akan memvalidasi ketersediaan stok sebelum memproses stock-out
2. **Automatic Updates**: Perubahan quantity akan otomatis mempengaruhi stok SKU
3. **Audit Trail**: Setiap transaksi mencatat user yang membuat perubahan
4. **Data Integrity**: Semua operasi menggunakan database transaction

## Usage Examples

### Create Stock Out

```javascript
const response = await fetch('/api/stock', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    skuId: 'uuid-of-sku',
    type: 'OUT',
    quantity: 10,
    unitPrice: 15000,
    totalPrice: 150000,
    documentNumber: 'SO-2024-001',
    notes: 'Sales transaction'
  })
});

const result = await response.json();
```

### Get Stock Out List

```javascript
const response = await fetch('/api/stock?type=OUT&page=1&limit=20');
const result = await response.json();
```

### Update Stock Out

```javascript
const response = await fetch('/api/stock/uuid', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantity: 15,
    notes: 'Updated quantity'
  })
});

const result = await response.json();
```

### Delete Stock Out

```javascript
const response = await fetch('/api/stock/uuid', {
  method: 'DELETE'
});

const result = await response.json();
```
