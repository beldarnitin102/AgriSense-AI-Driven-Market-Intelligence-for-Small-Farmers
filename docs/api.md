# API Documentation

## Base URL
```
https://your-api-gateway-url.amazonaws.com/prod
```

## Endpoints

### 1. Get Recommendation

Get market intelligence and selling recommendation for a crop.

**Endpoint:** `POST /recommendation`

**Request Body:**
```json
{
  "state": "maharashtra",
  "crop": "cotton",
  "location": "Akola",
  "quantity": 50
}
```

**Response:**
```json
{
  "recommendation": "Sell Now",
  "confidence": "High",
  "explanation": "Cotton prices have dropped 8% in the last month. Current price of ₹6000 is still above the yearly average. Selling now is recommended before prices fall further.",
  "priceRange": {
    "min": 5800,
    "max": 6200
  },
  "averagePrice": 6000,
  "trend": "Falling",
  "historicalPrices": [
    {"date": "2024-10-15", "price": 5900},
    {"date": "2024-10-16", "price": 5950}
  ],
  "nearbyMandis": [
    {
      "name": "Akola APMC",
      "distance": 5.2,
      "price": 6100,
      "priceComparison": "↑ 5% above average",
      "demand": "High",
      "coordinates": {"lat": 20.7002, "lng": 77.0082}
    }
  ],
  "userLocation": {"lat": 20.7002, "lng": 77.0082}
}
```

### 2. Get Analytics

Get analytics data for operator dashboard.

**Endpoint:** `GET /analytics`

**Query Parameters:**
- `state` (required): State identifier
- `start` (optional): Start date (YYYY-MM-DD)
- `end` (optional): End date (YYYY-MM-DD)

**Example:**
```
GET /analytics?state=maharashtra&start=2024-10-01&end=2025-01-14
```

**Response:**
```json
{
  "totalQueries": 1247,
  "topCrops": [
    {"crop": "Cotton", "queries": 456},
    {"crop": "Soybean", "queries": 342}
  ],
  "priceComparison": {
    "cotton": [
      {"mandi": "Akola", "price": 6100},
      {"mandi": "Nagpur", "price": 6000}
    ]
  },
  "recommendationStats": {
    "sellNow": 45,
    "wait": 30,
    "sellSoon": 25
  }
}
```

## Error Responses

All endpoints return standard error responses:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

## Rate Limiting

- 100 requests per hour per user
- Rate limit headers included in response

## Authentication

Currently using API Gateway API keys. Include in header:
```
X-Api-Key: your-api-key
```
