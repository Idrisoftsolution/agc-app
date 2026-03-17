# Plan Module Documentation

## Overview

The Plan module manages subscription plans for both regular users (shoppers) and store owners. It handles plan definitions, subscriptions, scan limits, upload limits, and payment processing via Razorpay.

---

## User Roles

| Role | Description |
|------|-------------|
| `user` | Regular shopper who can browse and scan jewelry |
| `owner` | Jewelry store owner who uploads and manages catalog |
| `admin` | Platform administrator |

---

## Plan Types

### User Plans (Shoppers)

| Plan ID | Name | Monthly Price | Quarterly Price | Scans/Day | Total Scans | Features |
|---------|------|---------------|-----------------|-----------|-------------|----------|
| `free` | Free | ₹0 | ₹0 | 3 | - | Browse, search, view store |
| `clicks_monthly` | Clicks Monthly | ₹29 | - | Unlimited | Unlimited | + Wishlist, notifications |
| `clicks_quarterly` | Clicks Quarterly | - | ₹79 | Unlimited | Unlimited | + Wishlist, notifications |

### Store Plans

| Plan ID | Name | Monthly Price | Quarterly Price | Max Uploads | Priority | Analytics | Leads |
|---------|------|---------------|------------------|-------------|----------|-----------|-------|
| `basic_monthly` | Basic Monthly | ₹199 | - | 150 | No | No | No |
| `basic_quarterly` | Basic Quarterly | - | ₹550 | 150 | No | No | No |
| `premium_monthly` | Premium Monthly | ₹399 | - | Unlimited | Yes | Yes | Yes |
| `premium_quarterly` | Premium Quarterly | - | ₹1100 | Unlimited | Yes | Yes | Yes |

---

## Models

### Plan Model (`src/models/plan.models.js`)

```javascript
{
  planId: String,          // unique identifier (e.g., "free", "clicks_monthly")
  name: String,             // display name
  description: String,      // plan description
  planType: String,         // "user" | "store"
  pricing: {
    monthly: Number,
    quarterly: Number,
    currency: String       // default: "INR"
  },
  features: {
    scansPerDay: Number,    // daily limit for free users
    scansPerMonth: Number, // monthly limit
    totalScans: Number,    // total scans in subscription
    unlimitedScans: Boolean,
    maxProductUploads: Number,
    priorityVisibility: Boolean,
    analytics: Boolean,
    leadNotifications: Boolean,
    wishlist: Boolean,
    notifications: Boolean
  },
  duration: {
    monthly: Number,        // days (30)
    quarterly: Number      // days (90)
  },
  isActive: Boolean,
  razorpayPlanId: {
    monthly: String,
    quarterly: String
  }
}
```

### Subscription Model (`src/models/subscription.models.js`)

```javascript
{
  subscriptionId: String,   // unique subscription ID
  userId: String,           // reference to User
  planId: String,           // reference to Plan
  subscriptionType: String,// "user" | "store"
  planDuration: String,     // "monthly" | "quarterly"
  status: String,           // "active" | "expired" | "cancelled" | "pending"
  scansUsed: Number,        // total scans used
  scansToday: Number,       // scans used today (for free users)
  lastScanDate: Date,      // last scan timestamp
  productsUploaded: Number,// products uploaded (for store owners)
  razorpaySubscriptionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  startDate: Date,
  endDate: Date,
  autoRenew: Boolean,
  cancelledAt: Date
}
```

---

## API Endpoints

### Plan Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/plan/all` | Get all plans | No |
| GET | `/api/plan/user-plans` | Get user plans only | No |
| GET | `/api/plan/store-plans` | Get store plans only | No |
| GET | `/api/plan/:planId` | Get plan by ID | No |

### Subscription Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/plan/subscribe` | Create subscription | Yes |
| POST | `/api/plan/verify-payment` | Verify and activate | Yes |
| GET | `/api/plan/my-subscription` | Get current subscription | Yes |
| POST | `/api/plan/cancel/:subscriptionId` | Cancel subscription | Yes |

### Scan Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/plan/check-scan-limit` | Check if user can scan | Yes |
| POST | `/api/plan/record-scan` | Record a scan | Yes |

### Store Upload Management

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/plan/check-upload-limit` | Check if can upload | Yes |
| POST | `/api/plan/record-upload` | Record an upload | Yes |
| GET | `/api/plan/store-analytics` | Get store analytics | Yes |

### Webhooks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/plan/webhook` | Handle Razorpay events | No |

---

## Request/Response Examples

### Get All Plans

**Request:**
```
GET /api/plan/all
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "planId": "free",
      "name": "Free",
      "planType": "user",
      "pricing": { "monthly": 0, "quarterly": 0 },
      "features": { "scansPerDay": 3, "unlimitedScans": false }
    }
  ]
}
```

### Subscribe to Plan

**Request:**
```
POST /api/plan/subscribe
Authorization: Bearer <token>
{
  "planId": "clicks_monthly",
  "duration": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "subscriptionId": "sub_abc123",
      "status": "pending"
    },
    "razorpayOrder": { "id": "sub_xyz789" },
    "price": 29
  }
}
```

### Check Scan Limit

**Request:**
```
POST /api/plan/check-scan-limit
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "allowed": true,
  "scansRemaining": 2,
  "isFreeUser": true
}
```

### Record Scan

**Request:**
```
POST /api/plan/record-scan
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Scan recorded",
  "scansRemaining": 1,
  "isFreeUser": true
}
```

---

## Scan Limit Logic

### Free Users
- Limit: 3 scans per day
- Reset: Daily at midnight
- Tracking: `scansToday` field in Subscription

### Paid Users (Clicks Plan)
- Limit: Unlimited scans
- Tracking: `scansUsed` field (no limit for unlimited plans)

### Store Upload Limit Logic

### Basic Plan
- Limit: 150 product uploads total
- Tracking: `productsUploaded` field in Subscription

### Premium Plan
- Limit: Unlimited uploads
- Features: Priority visibility, analytics, lead notifications

---

## Payment Flow

1. User selects plan and duration
2. Backend creates subscription with "pending" status
3. If paid plan → create Razorpay subscription
4. User completes payment
5. Frontend calls `/verify-payment` with payment details
6. Backend verifies and activates subscription
7. Subscription status → "active"

---

## Webhook Events Handled

| Event | Action |
|-------|--------|
| `subscription.charged` | Extend subscription end date |
| `subscription.cancelled` | Mark subscription as cancelled |
| `subscription.expired` | Mark subscription as expired |

---

## Error Responses

### Plan Not Found
```json
{
  "success": false,
  "message": "Plan not found"
}
```

### Limit Exceeded
```json
{
  "success": false,
  "message": "Daily scan limit exceeded. Please upgrade to Clicks plan for unlimited scans.",
  "limitExceeded": true,
  "scansRemaining": 0
}
```

### No Active Subscription
```json
{
  "success": false,
  "message": "No active store subscription. Please subscribe to a store plan.",
  "limitExceeded": true,
  "uploadsRemaining": 0
}
```

---

## Integration Notes

- Uses existing Razorpay integration
- Subscriptions linked to user accounts
- Daily scan reset handled on scan request
- Store subscription affects product upload permissions
- Analytics only available on Premium store plans
