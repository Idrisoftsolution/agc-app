# Product API Documentation

Base URL: `/api/product`

All endpoints (except noted otherwise) are publicly accessible. Protected routes require a JWT access token.

---

## Product Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | UUID (auto-generated) |
| `name` | string | Yes | Product name |
| `slug` | string | Yes | URL-friendly unique identifier (lowercase) |
| `catalogue` | string | Yes | Catalogue category |
| `material` | string | Yes | Enum: `gold`, `silver`, `diamond`, `platinum`, `artificial` |
| `price` | number | Yes | Product price (min: 0) |
| `stock` | number | No | Stock quantity (default: 0) |
| `description` | string | No | Product description |
| `tags` | string[] | No | Array of tags |
| `userId` | string | Yes | ID of the user who created the product |
| `image` | object | Yes | Image object with `source` and `key` |
| `createdAt` | Date | Auto | Timestamp |
| `updatedAt` | Date | Auto | Timestamp |

---

## Endpoints

### 1. Get All Products

**GET** `/api/product/all`

Returns all products in the database.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Gold Ring",
    "slug": "gold-ring",
    "catalogue": "rings",
    "material": "gold",
    "price": 50000,
    "stock": 10,
    "description": "Beautiful gold ring",
    "tags": ["wedding", "gold"],
    "userId": "user-uuid",
    "image": { "source": "url", "key": "key" },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 2. Get Product by ID

**GET** `/api/product/:id`

Returns a single product by its UUID.

**Parameters:**
- `id` (path) - Product UUID

**Response (success):**
```json
{
  "success": true,
  "product": { ... }
}
```

**Response (not found):**
```json
{
  "message": "Product not found",
  "success": false
}
```

---

### 3. Get Product by Slug

**GET** `/api/product/slug/:slug`

Returns a single product by its slug.

**Parameters:**
- `slug` (path) - Product slug (e.g., "gold-ring")

**Response (success):**
```json
{
  "success": true,
  "product": { ... }
}
```

**Response (not found):**
```json
{
  "message": "Product not found",
  "success": false
}
```

---

### 4. Get Products by Catalogue

**GET** `/api/product/catalogue/:catalogue`

Returns all products in a specific catalogue.

**Parameters:**
- `catalogue` (path) - Catalogue name (e.g., "rings", "necklaces")

**Response (success):**
```json
{
  "success": true,
  "products": [ ... ]
}
```

**Response (not found):**
```json
{
  "message": "No products found in this catalogue",
  "success": false
}
```

---

### 5. Get Products by Material

**GET** `/api/product/material/:material`

Returns all products of a specific material.

**Parameters:**
- `material` (path) - Material type: `gold`, `silver`, `diamond`, `platinum`, `artificial`

**Response (success):**
```json
{
  "success": true,
  "products": [ ... ]
}
```

**Response (not found):**
```json
{
  "message": "No products found with this material",
  "success": false
}
```

---

### 6. Get Products by User ID

**GET** `/api/product/user/:userId`

Returns all products created by a specific user.

**Parameters:**
- `userId` (path) - User UUID

**Response (success):**
```json
{
  "success": true,
  "products": [ ... ]
}
```

**Response (not found):**
```json
{
  "message": "No products found for this user",
  "success": false
}
```

---

### 7. Add Product

**POST** `/api/product/add`

**Authentication:** Required (JWT)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Gold Ring",
  "slug": "gold-ring",
  "catalogue": "rings",
  "material": "gold",
  "price": 50000,
  "stock": 10,
  "description": "Beautiful gold ring",
  "tags": ["wedding", "gold"],
  "image": {
    "source": "https://...",
    "key": "image-key"
  }
}
```

**Required fields:** `name`, `slug`, `catalogue`, `material`, `price`, `image.source`, `image.key`

**Response (success):**
```json
{
  "success": true,
  "product": { ... }
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "All required fields are missing",
  "data": { ... }
}
```

---

### 8. Update Product

**PUT** `/api/product/update`

**Authentication:** Required (JWT)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "id": "product-uuid",
  "data": {
    "name": "Updated Name",
    "price": 55000,
    "stock": 5
  }
}
```

**Response (success):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": { ... }
}
```

**Response (not found):**
```json
{
  "message": "Product not found"
}
```

---

### 9. Delete Product

**DELETE** `/api/product/:id`

**Authentication:** Required (JWT)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Parameters:**
- `id` (path) - Product UUID

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

**Response (error):**
```json
{
  "error": "Error message"
}
```

---

## Error Responses

All endpoints may return the following error formats:

```json
{
  "error": "Error message"
}
```

```json
{
  "message": "Error message"
}
```

---

## Authentication

Protected endpoints require a valid JWT access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

To obtain a token, use the authentication endpoints (see auth documentation).
