# Design Document
## AI Market Access & Price Intelligence Platform for Small Farmers (India)

---

## 1. High-Level System Architecture

### 1.1 Architecture Overview

The platform follows a serverless, event-driven architecture on AWS to ensure scalability, cost-efficiency, and minimal operational overhead.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  - React/Next.js Web App (Responsive)                           │
│  - Mobile-optimized PWA                                          │
│  - Farmer Mode UI + Operator Dashboard                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  - AWS API Gateway (REST API)                                   │
│  - Authentication & Rate Limiting                                │
│  - Request Validation                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  AWS Lambda Functions:                                           │
│  - getPriceData: Retrieve historical prices                     │
│  - analyzeTrends: Calculate trends and patterns                 │
│  - generateRecommendation: Rule + ML hybrid logic               │
│  - explainDecision: AI explanation via Bedrock                  │
│  - findNearbyMandis: Geospatial query                           │
│  - getAnalytics: Dashboard data aggregation                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AI/ML LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  - AWS Bedrock (Claude 3 Haiku)                                 │
│    • Explanation generation                                      │
│    • Insight summarization                                       │
│  - SageMaker (Optional)                                          │
│    • Simple regression models for trend prediction              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  - Amazon S3                                                     │
│    • Historical price data (CSV/Parquet)                        │
│    • Mandi metadata (JSON)                                      │
│    • Crop calendars and seasonal data                           │
│  - Amazon DynamoDB                                               │
│    • User queries and sessions                                  │
│    • Recommendation logs                                         │
│    • Alert subscriptions                                         │
│  - Amazon CloudFront                                             │
│    • CDN for static assets and cached data                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  - Google Maps API (mapping and navigation)                     │
│  - AWS Transcribe (voice input - optional)                      │
│  - AWS Polly (voice output - optional)                          │
│  - Amazon SNS (alerts and notifications)                        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

- **Serverless-first**: Minimize infrastructure management, pay-per-use pricing
- **State-partitioned**: Data and compute isolated by state for scalability
- **Cache-heavy**: Aggressive caching of historical data to reduce costs
- **Graceful degradation**: Core functionality works even if AI layer fails
- **Mobile-optimized**: Lightweight payloads, progressive enhancement

---

## 2. Data Flow Diagrams

### 2.1 Primary User Flow: Get Selling Recommendation

```
User Input (State, Crop, Location, Quantity)
    │
    ▼
API Gateway → Lambda: getPriceData
    │
    ├─→ S3: Fetch historical price CSV for state/crop
    │   └─→ Parse and filter last 12 months data
    │
    ▼
Lambda: analyzeTrends
    │
    ├─→ Calculate statistics (min, max, avg, stddev)
    ├─→ Compute moving averages (4-week, 12-week)
    ├─→ Detect trend direction and strength
    ├─→ Apply seasonal adjustment
    │
    ▼
Lambda: generateRecommendation
    │
    ├─→ Rule-based logic:
    │   • Check trend vs. current price
    │   • Check seasonal factors
    │   • Apply crop-specific rules
    │   └─→ Output: "Sell Now" / "Wait 2-4 weeks" / "Sell within 1-2 weeks"
    │
    ├─→ Optional ML enhancement:
    │   └─→ SageMaker: Simple regression for 2-week direction
    │
    ▼
Lambda: explainDecision
    │
    ├─→ Prepare context for LLM:
    │   • Historical summary
    │   • Trend analysis
    │   • Recommendation
    │   • Crop context
    │
    ├─→ AWS Bedrock (Claude 3 Haiku):
    │   • Prompt: "Explain in simple terms why [recommendation] based on [data]"
    │   • Temperature: 0.3 (deterministic)
    │   • Max tokens: 150
    │   └─→ Output: 2-3 sentence explanation
    │
    ▼
Lambda: findNearbyMandis
    │
    ├─→ S3: Fetch mandi metadata (coordinates, recent prices)
    ├─→ Calculate distances using Haversine formula
    ├─→ Sort by distance, filter within 100km
    ├─→ Annotate with price comparison indicators
    │
    ▼
Response to Client
    │
    ├─→ Expected price range
    ├─→ Trend indicator (arrow + color)
    ├─→ Recommendation with confidence
    ├─→ AI explanation
    ├─→ List of nearby mandis with details
    └─→ Map data for visualization
```

### 2.2 Analytics Dashboard Flow

```
Operator Request (Date range, Crops, Mandis)
    │
    ▼
API Gateway → Lambda: getAnalytics
    │
    ├─→ S3: Fetch aggregated price data
    ├─→ DynamoDB: Fetch query logs and recommendation stats
    │
    ├─→ Compute:
    │   • Price trends over time (multi-crop)
    │   • Mandi comparison matrix
    │   • Geographic heatmap data
    │   • Volume analysis (if available)
    │   • Recommendation acceptance rates
    │
    ▼
Response to Client
    │
    ├─→ Chart data (JSON)
    ├─→ Summary statistics
    ├─→ Heatmap coordinates
    └─→ Export link (pre-signed S3 URL for CSV)
```

---

## 3. State-Wise Data Model and Schema

### 3.1 Data Partitioning Strategy

Data is partitioned by state to enable:
- Independent scaling per state
- Localized data management
- Faster queries (smaller datasets)
- State-specific customization

### 3.2 S3 Data Structure

```
s3://farmer-market-intelligence/
├── historical-prices/
│   ├── maharashtra/
│   │   ├── cotton_2024.csv
│   │   ├── cotton_2025.csv
│   │   ├── soybean_2024.csv
│   │   └── ...
│   ├── karnataka/
│   │   ├── rice_2024.csv
│   │   └── ...
│   └── rajasthan/
│       └── ...
├── mandi-metadata/
│   ├── maharashtra_mandis.json
│   ├── karnataka_mandis.json
│   └── ...
├── crop-calendars/
│   ├── maharashtra_crops.json
│   └── ...
└── aggregated-analytics/
    ├── monthly_summaries/
    └── ...
```

### 3.3 Historical Price Data Schema (CSV)

```csv
date,mandi_name,mandi_code,crop,variety,min_price,max_price,modal_price,volume_quintals
2025-01-10,Akola,MH001,Cotton,Medium Staple,5800,6200,6000,1250
2025-01-10,Nagpur,MH002,Cotton,Medium Staple,5900,6300,6100,980
...
```

**Fields**:
- `date`: YYYY-MM-DD format
- `mandi_name`: Human-readable mandi name
- `mandi_code`: Unique identifier (state prefix + number)
- `crop`: Standardized crop name
- `variety`: Crop variety/grade
- `min_price`, `max_price`, `modal_price`: Prices in ₹ per quintal
- `volume_quintals`: Trading volume (optional, may be null)

### 3.4 Mandi Metadata Schema (JSON)

```json
{
  "state": "Maharashtra",
  "mandis": [
    {
      "code": "MH001",
      "name": "Akola APMC",
      "district": "Akola",
      "latitude": 20.7002,
      "longitude": 77.0082,
      "crops_traded": ["Cotton", "Soybean", "Wheat"],
      "facilities": ["weighbridge", "storage"],
      "contact": "+91-724-xxx-xxxx",
      "operating_days": ["Monday", "Tuesday", "Wednesday", "Friday"]
    },
    ...
  ]
}
```

### 3.5 DynamoDB Tables

#### Table: UserQueries
```
Partition Key: userId (string)
Sort Key: timestamp (number)

Attributes:
- queryId (string)
- state (string)
- crop (string)
- location (map: {lat, lon})
- quantity (number)
- recommendation (string)
- confidence (string)
- mandisShown (list)
- sessionId (string)
```

#### Table: RecommendationLogs
```
Partition Key: state (string)
Sort Key: timestamp (number)

Attributes:
- queryId (string)
- crop (string)
- recommendation (string)
- trendDirection (string)
- currentPrice (number)
- avgPrice (number)
- userAccepted (boolean, updated later if feedback available)
```

#### Table: AlertSubscriptions
```
Partition Key: userId (string)
Sort Key: alertId (string)

Attributes:
- crop (string)
- targetPrice (number)
- mandis (list)
- phoneNumber (string)
- active (boolean)
- createdAt (number)
```

---

## 4. AI Decision Logic

### 4.1 Rule-Based Recommendation Engine

The core recommendation logic uses deterministic rules based on historical data analysis. This ensures transparency and explainability.

#### Input Parameters:
- `current_price`: Latest reported modal price
- `avg_12week`: 12-week moving average
- `avg_4week`: 4-week moving average
- `trend_direction`: Rising / Stable / Falling
- `trend_strength`: Strong / Moderate / Weak
- `seasonal_factor`: Peak / Off-peak / Transition
- `price_percentile`: Current price position in yearly distribution (0-100)

#### Decision Rules:

```
Rule 1: Falling Trend + High Current Price
IF trend_direction == "Falling" AND current_price > avg_12week * 1.05
THEN recommendation = "Sell Now"
     confidence = "High"
     reason = "Prices are declining but still above average"

Rule 2: Rising Trend + Low Current Price
IF trend_direction == "Rising" AND current_price < avg_12week * 0.95
THEN recommendation = "Wait 2-4 weeks"
     confidence = "Medium"
     reason = "Prices are rising and currently below average"

Rule 3: Peak Harvest Season
IF seasonal_factor == "Peak" AND current_price > avg_12week * 0.90
THEN recommendation = "Sell Now"
     confidence = "High"
     reason = "Harvest peak may cause price drop due to supply glut"

Rule 4: Stable Market + Average Price
IF trend_direction == "Stable" AND 0.95 < (current_price / avg_12week) < 1.05
THEN recommendation = "Sell within 1-2 weeks"
     confidence = "Medium"
     reason = "Market is stable, no strong signal to wait"

Rule 5: Strong Rising Trend
IF trend_direction == "Rising" AND trend_strength == "Strong"
THEN recommendation = "Wait 2-4 weeks"
     confidence = "Medium"
     reason = "Strong upward trend suggests better prices ahead"

Rule 6: Price at Yearly High
IF price_percentile > 85
THEN recommendation = "Sell Now"
     confidence = "High"
     reason = "Current price is near yearly high"

Default Rule:
IF no specific rule matches
THEN recommendation = "Sell within 1-2 weeks"
     confidence = "Low"
     reason = "Market conditions are unclear, moderate timing suggested"
```

### 4.2 ML Enhancement (Optional)

For states with sufficient data (>2 years of daily prices), a simple regression model can enhance recommendations.

#### Model: Linear Regression on Time Series Features

**Features**:
- 4-week moving average
- 12-week moving average
- Price momentum (current - 1 week ago)
- Seasonal indicator (month of year)
- Volume trend (if available)

**Target**: Price direction in 2 weeks (Up / Down / Stable)

**Training**:
- Historical data split: 80% train, 20% validation
- Model trained per state-crop combination
- Retrained monthly with new data

**Usage**:
- ML prediction used as additional signal, not primary decision
- If ML confidence > 70% and agrees with rules: increase confidence
- If ML conflicts with rules: flag as "uncertain" and rely on rules
- ML failure does not block recommendation

**Model Storage**: S3 bucket with versioning, loaded into Lambda memory

### 4.3 Trend Detection Algorithm

```python
# Pseudocode for trend detection

def detect_trend(prices_12week, prices_4week):
    avg_12week = mean(prices_12week)
    avg_4week = mean(prices_4week)
    
    # Calculate percentage change
    change_pct = ((avg_4week - avg_12week) / avg_12week) * 100
    
    # Determine direction
    if change_pct > 5:
        direction = "Rising"
    elif change_pct < -5:
        direction = "Falling"
    else:
        direction = "Stable"
    
    # Determine strength based on consistency
    price_changes = [prices_4week[i] - prices_4week[i-1] 
                     for i in range(1, len(prices_4week))]
    
    consistent_direction = sum(1 for x in price_changes 
                               if (x > 0 and direction == "Rising") or 
                                  (x < 0 and direction == "Falling"))
    
    consistency_ratio = consistent_direction / len(price_changes)
    
    if consistency_ratio > 0.75:
        strength = "Strong"
    elif consistency_ratio > 0.5:
        strength = "Moderate"
    else:
        strength = "Weak"
    
    return direction, strength
```

---

## 5. Explanation Generation Flow

### 5.1 AWS Bedrock Integration

**Model**: Claude 3 Haiku (cost-effective, fast, good for structured tasks)

**Prompt Template**:
```
You are an agricultural advisor helping small farmers in India understand market conditions.

Context:
- Crop: {crop_name}
- State: {state_name}
- Current price: ₹{current_price} per quintal
- 12-week average price: ₹{avg_price} per quintal
- Price trend: {trend_direction} ({trend_strength})
- Recommendation: {recommendation}

Task: Explain in 2-3 simple sentences why this recommendation makes sense based on the data. Use simple language suitable for farmers with basic literacy. Do not make price predictions or guarantees.

Explanation:
```

**Parameters**:
- Temperature: 0.3 (low randomness for consistency)
- Max tokens: 150
- Stop sequences: ["\n\n"]

**Example Output**:
"Cotton prices have dropped by 8% in the last month. However, the current price of ₹6000 is still above the 3-month average of ₹5700. Selling now is a good choice before prices fall further."

### 5.2 Fallback Mechanism

If Bedrock API fails or times out:
1. Use template-based explanation with data substitution
2. Log failure for monitoring
3. Return explanation with lower confidence indicator

**Template Example**:
"Based on recent market data, {crop} prices are {trend_direction}. Current price is {comparison} the recent average. {recommendation_text}."

### 5.3 Localization

- Explanation generated in English
- Frontend translates to local language using pre-translated templates
- Key data points (numbers, dates) inserted dynamically
- Future: Direct multilingual generation via Bedrock

---

## 6. UI/UX Layout Description

### 6.1 Farmer Mode (Mobile-First)

#### Home Screen
- **Header**: Logo, language selector, help icon
- **State Selection**: Large cards with state names and icons
- **Quick Access**: "Recent Searches" section

#### Crop Selection Screen
- **Search bar**: Type crop name
- **Grid of crop cards**: Image, name, season indicator
- **Filter**: By season, category

#### Query Input Screen
- **Location input**: Auto-detect or manual entry (district dropdown)
- **Quantity input**: Number pad, unit selector (quintal/kg)
- **Submit button**: Large, prominent "Get Recommendation"

#### Results Screen (Primary View)
- **Top Card - Recommendation**:
  - Large icon: ✓ "Sell Now" / ⏳ "Wait" / ⚡ "Sell Soon"
  - Color-coded: Green / Yellow / Orange
  - Confidence badge: High / Medium / Low
  - AI Explanation: 2-3 sentences in local language
  
- **Price Info Card**:
  - Current price range: ₹5800 - ₹6200
  - Average price: ₹6000
  - Trend indicator: ↗ Rising / → Stable / ↘ Falling
  - Mini chart: Last 3 months trend

- **Nearby Mandis Section**:
  - Toggle: List View / Map View
  - **List View**: Cards showing:
    - Mandi name
    - Distance (km)
    - Price: ₹6100 (↑ 5% above average)
    - Demand indicator: 🟢 High / 🟡 Medium / 🔴 Low
    - "Get Directions" button
  - **Map View**: Interactive map with color-coded markers

- **Action Buttons**:
  - "Set Price Alert"
  - "Share with Others"
  - "New Search"

### 6.2 Operator Dashboard (Desktop/Tablet)

#### Layout: Sidebar + Main Content

**Sidebar**:
- State selector
- Crop multi-select
- Date range picker
- Mandi filter
- Export button

**Main Content - Tabs**:

**Tab 1: Price Trends**
- Multi-line chart: Price over time for selected crops
- Legend with color coding
- Hover tooltips with exact values
- Zoom and pan controls

**Tab 2: Mandi Comparison**
- Table view: Mandis as rows, crops as columns
- Heatmap coloring: Green (high) to Red (low)
- Sort by any column
- Click row to see detailed mandi profile

**Tab 3: Geographic Heatmap**
- State map with district-level price coloring
- Intensity indicates price level
- Click district to see mandi list
- Filter by crop

**Tab 4: Analytics Summary**
- KPI cards:
  - Total queries this month
  - Most searched crops
  - Average price realization
  - Recommendation acceptance rate
- Recent activity feed
- Alert summary

### 6.3 Design System

**Colors**:
- Primary: #2E7D32 (Green - agriculture theme)
- Secondary: #FF6F00 (Orange - alerts)
- Success: #4CAF50
- Warning: #FFC107
- Danger: #F44336
- Neutral: #757575

**Typography**:
- Headings: Poppins (clean, modern)
- Body: Inter (readable, web-optimized)
- Numbers: Roboto Mono (clear distinction)

**Components**:
- Cards: Rounded corners (8px), subtle shadow
- Buttons: Large (48px height), high contrast
- Icons: Material Design Icons
- Charts: Recharts library (React)
- Maps: Google Maps React wrapper

**Responsive Breakpoints**:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 7. Security & Scalability Considerations

### 7.1 Security Measures

#### Authentication & Authorization
- API Gateway with API key authentication
- Rate limiting: 100 requests/hour per user
- IP-based throttling for abuse prevention
- No user passwords (optional phone-based OTP for alerts)

#### Data Protection
- All data in transit encrypted (TLS 1.3)
- S3 buckets: Private, no public access
- DynamoDB: Encryption at rest enabled
- No PII stored except optional phone numbers (hashed)

#### API Security
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection (sanitized outputs)
- CORS configured for specific domains only

#### Compliance
- Data residency: All data in AWS Mumbai region (ap-south-1)
- Audit logging: CloudTrail enabled
- Privacy policy: Clear data usage disclosure
- Disclaimer: "Informational purposes only" on all pages

### 7.2 Scalability Architecture

#### Horizontal Scaling
- Lambda: Auto-scales to 1000 concurrent executions per state
- API Gateway: Handles 10,000 requests/second
- DynamoDB: On-demand capacity mode (auto-scaling)
- CloudFront: Global CDN for static assets

#### Data Partitioning
- State-level partitioning reduces query scope
- S3 data organized by state/crop/year for fast retrieval
- DynamoDB partition key design prevents hot partitions

#### Caching Strategy
- CloudFront: Cache static assets (24 hours)
- API Gateway: Cache GET responses (5 minutes)
- Lambda: In-memory caching of frequently accessed data
- Browser: LocalStorage for recent searches

#### Cost Optimization
- Lambda: Right-sized memory allocation (512MB - 1GB)
- S3: Lifecycle policies (move old data to Glacier after 2 years)
- DynamoDB: TTL on old query logs (delete after 90 days)
- Bedrock: Batch explanation requests where possible

#### Performance Optimization
- S3 data format: Parquet for analytics (faster than CSV)
- Lambda cold start mitigation: Provisioned concurrency for critical functions
- Database indexes: GSI on frequently queried attributes
- Lazy loading: Load map data only when map view selected

### 7.3 Monitoring & Observability

#### Metrics (CloudWatch)
- API latency (p50, p95, p99)
- Lambda execution duration and errors
- Bedrock API success rate and latency
- DynamoDB read/write capacity utilization
- User query volume by state/crop

#### Alarms
- API error rate > 5%
- Lambda timeout rate > 2%
- Bedrock failure rate > 10%
- DynamoDB throttling events

#### Logging
- Structured JSON logs (CloudWatch Logs)
- Request/response logging (sanitized)
- Error stack traces
- User journey tracking (anonymized)

#### Dashboards
- Real-time operational dashboard (CloudWatch)
- Business metrics dashboard (QuickSight)
- Cost tracking dashboard

---

## 8. Future Enhancement Roadmap

### Phase 2 (3-6 months post-MVP)
- **Voice Interface**: Full voice input/output in regional languages
- **Offline Mode**: PWA with offline data sync
- **SMS Integration**: Price alerts and recommendations via SMS
- **Weather Integration**: Harvest timing recommendations based on forecast
- **Quality Assessment**: Image-based crop quality grading

### Phase 3 (6-12 months)
- **Demand Forecasting**: ML models for demand prediction
- **e-NAM Integration**: Real-time data from National Agriculture Market
- **Cooperative Features**: Group selling coordination
- **Personalization**: Farm profile-based recommendations
- **Blockchain**: Transparent price history verification

### Phase 4 (12+ months)
- **Marketplace**: Direct farmer-to-buyer connections
- **Logistics**: Transport and cold storage integration
- **Financial Services**: Credit and insurance recommendations
- **Supply Chain**: End-to-end traceability
- **Expansion**: Pan-India coverage, 20+ states

---

## 9. Technical Implementation Notes

### 9.1 Lambda Function Specifications

#### Function: getPriceData
- Runtime: Python 3.11
- Memory: 512 MB
- Timeout: 10 seconds
- Triggers: API Gateway
- Dependencies: pandas, boto3
- Estimated cost: $0.0001 per invocation

#### Function: analyzeTrends
- Runtime: Python 3.11
- Memory: 1024 MB
- Timeout: 15 seconds
- Dependencies: numpy, pandas, scipy
- Estimated cost: $0.0002 per invocation

#### Function: explainDecision
- Runtime: Python 3.11
- Memory: 512 MB
- Timeout: 30 seconds
- Dependencies: boto3 (Bedrock SDK)
- Estimated cost: $0.0005 per invocation (including Bedrock API)

#### Function: findNearbyMandis
- Runtime: Python 3.11
- Memory: 256 MB
- Timeout: 5 seconds
- Dependencies: geopy, boto3
- Estimated cost: $0.00005 per invocation

### 9.2 Data Ingestion Pipeline

**Source**: Public datasets (Agmarknet, state agriculture portals)

**Pipeline**:
1. **Extract**: Daily cron job (EventBridge) triggers Lambda
2. **Transform**: Clean, validate, standardize format
3. **Load**: Upload to S3 with versioning
4. **Validate**: Data quality checks (outlier detection)
5. **Notify**: SNS notification on successful update

**Data Freshness**: Target 24-hour lag, acceptable up to 7 days

### 9.3 Frontend Technology Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **Charts**: Recharts
- **Maps**: @react-google-maps/api
- **Internationalization**: next-i18next
- **PWA**: next-pwa plugin
- **Deployment**: AWS Amplify or Vercel

### 9.4 Development & Deployment

**Version Control**: Git (GitHub/GitLab)

**CI/CD Pipeline**:
- Code commit → GitHub Actions
- Automated tests (unit, integration)
- Lambda deployment via AWS SAM
- Frontend deployment via Amplify
- Rollback capability

**Environments**:
- Development: Local + AWS dev account
- Staging: Separate AWS account, production-like
- Production: Isolated AWS account, multi-AZ

**Infrastructure as Code**: AWS SAM / CloudFormation templates

---

## 10. Risk Mitigation

### Technical Risks

**Risk**: Data source unavailability
- **Mitigation**: Multiple data sources, cached fallback data, clear "data unavailable" messaging

**Risk**: Bedrock API rate limits or failures
- **Mitigation**: Template-based fallback, request queuing, graceful degradation

**Risk**: High costs due to unexpected usage
- **Mitigation**: Budget alarms, rate limiting, cost monitoring dashboard

**Risk**: Poor mobile performance on 2G/3G
- **Mitigation**: Aggressive caching, lazy loading, lightweight payloads (<100KB)

### Business Risks

**Risk**: Low user adoption
- **Mitigation**: Partnerships with Krushi Seva Kendras, NGO outreach, farmer training programs

**Risk**: Inaccurate recommendations damage trust
- **Mitigation**: Conservative confidence levels, clear disclaimers, feedback loop for improvement

**Risk**: Data quality issues
- **Mitigation**: Automated validation, manual spot checks, source diversification

### Operational Risks

**Risk**: Lack of domain expertise
- **Mitigation**: Advisory board of agricultural experts, user testing with real farmers

**Risk**: Regulatory compliance issues
- **Mitigation**: Legal review, no claims of official endorsement, transparent data sourcing

---

## Document Version
- Version: 1.0
- Date: January 2026
- Status: Final for Prototype Development
- Reviewed by: Product Architecture Team
