# Stock-In API Documentation

## Overview

API for managing stock-in (incoming goods) in the StoqCloud system. This API follows the same conventions as other APIs in the project.

## Endpoints

### 1. GET /api/stock-in

Get list of stock-in transactions with pagination and filtering.

**Query Parameters:**

- `keyword` (optional): Search by SKU name
- `page` (optional): Page number (default: 1)
- `sort` (optional): Sort order - "asc" or "desc" (default: "desc")
- `sortBy` (optional): Field to sort by - "createdAt" or "documentNumber" (default: "createdAt")
- `type` (optional): Filter by type - "IN" or "OUT" (default: all)

**Response:**

```json
{
  "success": true,
  "meta": {
    "totalCount": 10,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 20
  },
  "data": [
    {
      "id": "uuid",
      "skuId": "uuid",
      "type": "IN",
      "quantity": 100,
      "unitPrice": "15000.00",
      "totalPrice": "1500000.00",
      "documentNumber": "PO-2024-001",
      "notes": "Stock from supplier",
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
  ]
}
```

### 2. POST /api/stock-in

Create a new stock-in transaction.

**Request Body:**

```json
{
  "skuId": "uuid",
  "quantity": 100,
  "unitPrice": 15000,
  "totalPrice": 1500000,
  "documentNumber": "PO-2024-001",
  "notes": "Stock from supplier"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "IN",
    "quantity": 100,
    "unitPrice": "15000.00",
    "totalPrice": "1500000.00",
    "documentNumber": "PO-2024-001",
    "notes": "Stock from supplier",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. GET /api/stock-in/[id]

Get stock-in transaction details by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "IN",
    "quantity": 100,
    "unitPrice": "15000.00",
    "totalPrice": "1500000.00",
    "documentNumber": "PO-2024-001",
    "notes": "Stock from supplier",
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

### 4. PATCH /api/stock-in/[id]

Update stock-in transaction.

**Request Body:**

```json
{
  "quantity": 150,
  "unitPrice": 16000,
  "totalPrice": 2400000,
  "documentNumber": "PO-2024-001-REV",
  "notes": "Update quantity"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "IN",
    "quantity": 150,
    "unitPrice": "16000.00",
    "totalPrice": "2400000.00",
    "documentNumber": "PO-2024-001-REV",
    "notes": "Update quantity",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. DELETE /api/stock-in/[id]

Delete stock-in transaction.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "skuId": "uuid",
    "type": "IN",
    "quantity": 100,
    "unitPrice": "15000.00",
    "totalPrice": "1500000.00",
    "documentNumber": "PO-2024-001",
    "notes": "Stock from supplier",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Features

### Automatic Stock Update

- When stock-in is created, SKU quantity will automatically increase
- When stock-in is updated, SKU quantity will be adjusted by the difference
- When stock-in is deleted, SKU quantity will be decreased

### Transaction Safety

- All operations use database transactions to ensure data consistency
- If there's an error, all changes will be rolled back

### Validation

- Input validation using Zod schema
- Quantity must be positive
- Unit price and total price cannot be negative
- Only "IN" type is allowed for stock-in API
- Type uses PostgreSQL enum to ensure data integrity

### Authentication

- All endpoints require authentication
- Uses `requireUserAuth` middleware

## Error Handling

API returns error response with format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common error codes:

- 401: Unauthorized (no session)
- 400: Bad Request (validation failed or data not found)
