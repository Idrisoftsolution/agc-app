# Store Module Documentation

## Overview

The Store module manages jewelry store profiles on the platform. Store owners can create and manage their stores, upload jewelry catalogs, and get analytics on their store performance. Users can discover stores, view store profiles, and get directions.

---

## User Roles

| Role | Description |
|------|-------------|
| `user` | Regular shopper who can browse stores |
| `owner` | Jewelry store owner who manages store |
| `admin` | Platform administrator |

---

## Store Model

### Schema (`src/models/store.models.js`)

```javascript
{
  storeId: String,          // unique store identifier
  ownerId: String,          // reference to User
  storeName: String,        // store display name
  storeSlug: URL,            // SEO-friendly URL slug
  description: String,      // store description
  logo: String,             // store logo URL
  coverImage: String,       // cover image URL
  contact: {
    phone: String,
    email: String,
    whatsapp: String
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String         // default: "India"
  },
  location: {
    type: String,          // "Point"
    coordinates: [Number]  // [longitude, latitude]
  },
  businessHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  socialLinks: {
    instagram: String,
    facebook: String,
    website: String
  },
  isVerified: Boolean,      // admin-verified store
  isActive: Boolean,         // soft delete flag
  analytics: {
    totalViews: Number,     // profile views
    totalScans: Number,      // scan matches
    totalLeads: Number,      // customer inquiries
    totalFavorites: Number  // times favorited
  },
  subscription: {
    planId: String,
    status: String,         // "inactive" | "active" | "expired"
    startDate: Date,
    endDate: Date
  }
}
```

---

## API Endpoints

### Store Management (Owner)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/store` | Create new store | Yes (owner only) |
| GET | `/api/store/my-store` | Get my store | Yes (owner only) |
| PUT | `/api/store/my-store` | Update store | Yes (owner only) |
| DELETE | `/api/store/my-store` | Delete store | Yes (owner only) |

### Store Discovery (Users)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/store/all` | List all stores | No |
| GET | `/api/store/search` | Search stores | No |
| GET | `/api/store/nearby` | Get nearby stores | No |
| GET | `/api/store/:storeId` | Get store by ID | No |
| GET | `/api/store/slug/:storeSlug` | Get store by slug | No |

---

## Request/Response Examples

### Create Store

**Request:**
```
POST /api/store
Authorization: Bearer <token>
{
  "storeName": "Royal Jewellers",
  "description": "Premium jewelry since 1985",
  "contact": {
    "phone": "+91-9876543210",
    "email": "contact@royaljewellers.com",
    "whatsapp": "+91-9876543210"
  },
  "address": {
    "line1": "123 MG Road",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "location": {
    "type": "Point",
    "coordinates": [72.8777, 19.0760]
  },
  "businessHours": {
    "monday": { "open": "10:00", "close": "19:00", "isClosed": false },
    "sunday": { "isClosed": true }
  },
  "socialLinks": {
    "instagram": "@royaljewellers",
    "website": "https://royaljewellers.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store created successfully",
  "data": {
    "storeId": "store_abc123def",
    "storeSlug": "royal-jewellers-abc123de",
    "storeName": "Royal Jewellers",
    "ownerId": "user_123",
    "isActive": true,
    "isVerified": false,
    "analytics": {
      "totalViews": 0,
      "totalScans": 0,
      "totalLeads": 0,
      "totalFavorites": 0
    },
    "subscription": {
      "status": "inactive"
    }
  }
}
```

### Get All Stores

**Request:**
```
GET /api/store/all?page=1&limit=20&city=Mumbai&verified=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "storeId": "store_abc123",
      "storeName": "Royal Jewellers",
      "storeSlug": "royal-jewellers-abc",
      "description": "Premium jewelry since 1985",
      "logo": "https://s3.../logo.jpg",
      "coverImage": "https://s3.../cover.jpg",
      "address": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "isVerified": true,
      "analytics": {
        "totalViews": 1500,
        "totalScans": 320,
        "totalLeads": 45
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Search Stores

**Request:**
```
GET /api/store/search?q=gold&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "storeId": "store_xyz789",
      "storeName": "Gold Palace",
      "description": "Best gold jewelry in town",
      "address": { "city": "Delhi" },
      "isVerified": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Get Nearby Stores

**Request:**
```
GET /api/store/nearby?longitude=72.8777&latitude=19.0760&maxDistance=10000
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "storeId": "store_abc123",
      "storeName": "Diamond Emporium",
      "address": {
        "city": "Mumbai",
        "line1": "5 km away"
      }
    }
  ]
}
```

### Get Store by ID

**Request:**
```
GET /api/store/store_abc123def
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storeId": "store_abc123def",
    "storeName": "Royal Jewellers",
    "storeSlug": "royal-jewellers-abc123de",
    "description": "Premium jewelry since 1985",
    "logo": "https://s3.../logo.jpg",
    "coverImage": "https://s3.../cover.jpg",
    "contact": {
      "phone": "+91-9876543210",
      "email": "contact@royaljewellers.com",
      "whatsapp": "+91-9876543210"
    },
    "address": {
      "line1": "123 MG Road",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    },
    "location": {
      "type": "Point",
      "coordinates": [72.8777, 19.0760]
    },
    "businessHours": {
      "monday": { "open": "10:00", "close": "19:00", "isClosed": false },
      "tuesday": { "open": "10:00", "close": "19:00", "isClosed": false }
    },
    "socialLinks": {
      "instagram": "@royaljewellers",
      "website": "https://royaljewellers.com"
    },
    "isVerified": true,
    "isActive": true,
    "analytics": {
      "totalViews": 1500,
      "totalScans": 320,
      "totalLeads": 45,
      "totalFavorites": 120
    }
  }
}
```

### Update Store

**Request:**
```
PUT /api/store/my-store
Authorization: Bearer <token>
{
  "storeName": "Royal Jewellers & Co",
  "description": "Premium jewelry since 1985 - Now with diamond collection",
  "contact": {
    "phone": "+91-9876543211"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Store updated successfully",
  "data": {
    "storeId": "store_abc123def",
    "storeName": "Royal Jewellers & Co",
    "storeSlug": "royal-jewellers--abc123de",
    ...
  }
}
```

---

## Analytics Tracking

The system automatically tracks:

| Metric | Description | When Updated |
|--------|-------------|--------------|
| `totalViews` | Profile views | User visits store page |
| `totalScans` | Scan matches | User scans jewelry from this store |
| `totalLeads` | Contact requests | User shows interest |
| `totalFavorites` | Times favorited | User favorites store |

---

## Subscription Integration

Stores are linked to subscriptions:

```javascript
subscription: {
  planId: "premium_monthly",
  status: "active",
  startDate: "2024-01-01",
  endDate: "2024-02-01"
}
```

### Plan Features for Stores

| Feature | Basic | Premium |
|---------|-------|---------|
| Product Uploads | 150 | Unlimited |
| Search Visibility | Yes | Yes |
| Scan Results | Yes | Priority |
| Profile Analytics | No | Yes |
| Lead Notifications | No | Yes |

---

## Business Hours Format

```javascript
businessHours: {
  monday: {
    open: "10:00",      // 24-hour format
    close: "19:00",
    isClosed: false
  },
  sunday: {
    isClosed: true     // closed all day
  }
}
```

---

## Location Format

Uses GeoJSON Point format for geospatial queries:

```javascript
location: {
  type: "Point",
  coordinates: [longitude, latitude]
}
```

Supports queries like:
- Find stores within X meters
- Find nearest stores
- Distance-based sorting

---

## Error Responses

### Store Already Exists
```json
{
  "success": false,
  "message": "You already have a store"
}
```

### Store Not Found
```json
{
  "success": false,
  "message": "Store not found"
}
```

### Not a Store Owner
```json
{
  "success": false,
  "message": "Only store owners can create a store"
}
```

### Missing Location
```json
{
  "success": false,
  "message": "Longitude and latitude are required"
}
```

---

## Integration Notes

- Store creation requires `owner` role
- One store per owner
- Location enables nearby store discovery
- Slug is auto-generated from store name
- Analytics auto-increment on user actions
- Soft delete via `isActive` flag
- Supports both ID and slug lookups
