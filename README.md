# AI Market Access & Price Intelligence Platform

A production-grade prototype for providing market intelligence and decision support to small farmers in India.

## 🎯 Problem Statement

Small and marginal farmers in India lack transparent, location-specific market intelligence. They often depend on middlemen due to poor access to mandi prices, unclear demand trends, and lack of decision support on when and where to sell crops.

## 💡 Solution

An AI-powered, state-wise market intelligence system that provides farmers with:
- **Decision support** (not price prediction hype)
- **Best mandi recommendations** based on distance and prices
- **Optimal selling time guidance** using historical data analysis
- **Explainable AI** that farmers can understand

## 🏗️ Project Structure

```
├── frontend/              # Next.js web application (mobile-first)
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   └── lib/          # API client and utilities
│   └── package.json
│
├── backend/              # AWS Lambda functions (Python)
│   ├── functions/
│   │   ├── get_recommendation/  # Main recommendation engine
│   │   └── get_analytics/       # Dashboard analytics
│   ├── template.yaml     # AWS SAM template
│   └── requirements.txt
│
├── infrastructure/       # Infrastructure documentation
├── data/                # Sample datasets and schemas
├── docs/                # Comprehensive documentation
├── scripts/             # Utility scripts
│
├── requirements.md      # Detailed requirements
├── design.md           # System design document
├── ARCHITECTURE.md     # Architecture overview
└── PROJECT_STATUS.md   # Current status and roadmap
```

## 🚀 Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: Google Maps API
- **State Management**: React Context + Hooks

### Backend
- **Compute**: AWS Lambda (Python 3.11)
- **API**: AWS API Gateway (REST)
- **AI**: AWS Bedrock (Claude 3 Haiku)
- **Storage**: Amazon S3, DynamoDB
- **Libraries**: Pandas, NumPy, GeoPy

### Infrastructure
- **IaC**: AWS SAM / CloudFormation
- **Monitoring**: CloudWatch
- **CDN**: CloudFront (planned)

## 📋 Prerequisites

- Node.js 18+
- Python 3.11+
- AWS CLI configured
- AWS SAM CLI
- AWS Account with Bedrock access

## 🛠️ Quick Start

### Local Development (Easiest)

**Option 1: Use Startup Script**
```bash
# Windows
start-project.bat

# Or PowerShell
.\start-project.ps1
```

**Option 2: Manual Start (Two Terminals)**

Terminal 1 - Backend:
```bash
cd backend
node local-server.js
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install  # First time only
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### AWS Deployment (Production)

1. **Deploy Backend:**
```bash
cd backend
sam build
sam deploy --guided
```

2. **Upload Sample Data:**
```bash
aws s3 cp data/sample-price-data.csv s3://YOUR-BUCKET/historical-prices/maharashtra/cotton_2025.csv
aws s3 cp data/sample-mandi-metadata.json s3://YOUR-BUCKET/mandi-metadata/maharashtra_mandis.json
```

3. **Deploy Frontend:**
```bash
cd frontend
npm install
npm run build
# Deploy to AWS Amplify (see docs/deployment.md)
```

For detailed deployment instructions, see **[docs/deployment.md](docs/deployment.md)**

## 📚 Documentation

- **[requirements.md](requirements.md)** - Detailed functional and non-functional requirements
- **[design.md](design.md)** - System architecture and design decisions
- **[RUN_PROJECT.md](RUN_PROJECT.md)** - Complete guide to run the project locally
- **[docs/api.md](docs/api.md)** - API endpoints and usage
- **[docs/deployment.md](docs/deployment.md)** - Step-by-step AWS deployment guide

## 🎨 Key Features

### For Farmers
- ✅ Simple state → crop → location flow
- ✅ Clear "Sell Now" / "Wait" recommendations
- ✅ AI explanations in simple language
- ✅ Nearby mandi discovery with distances
- ✅ Price trend visualization
- ✅ Map-based navigation

### For Operators (Krushi Seva Kendra)
- ✅ Analytics dashboard
- ✅ Multi-crop price comparison
- ✅ Mandi performance tracking
- ✅ Query statistics

### Technical Features
- ✅ Serverless architecture (auto-scaling)
- ✅ Rule-based recommendation engine
- ✅ AI-powered explanations (AWS Bedrock)
- ✅ Geospatial mandi search
- ✅ Historical price analysis
- ✅ Mobile-first responsive design

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint

# Backend (local testing)
cd backend
sam local start-api
```

## 💰 Cost Estimate

**Monthly Operating Cost** (10,000 queries):
- AWS Lambda: $0.50
- API Gateway: $0.04
- DynamoDB: $1.50
- S3: $0.10
- Bedrock: $3.00
- **Total: ~$5/month**

## 🔒 Security

- ✅ HTTPS only (TLS 1.3)
- ✅ S3 buckets private
- ✅ DynamoDB encryption at rest
- ✅ IAM least privilege
- ✅ API rate limiting (100 req/hour)
- ✅ No PII collection

## 📈 Scalability

- Lambda: 1000 concurrent executions per state
- API Gateway: 10,000 requests/second
- DynamoDB: On-demand auto-scaling
- Target: 10 states, 50 crops, 500 mandis

## 🚧 Current Status

**Status**: ✅ MVP Complete and Running

### What's Included
- ✅ Complete documentation (requirements, design, API docs)
- ✅ Full-stack application (Frontend + Backend)
- ✅ AWS serverless infrastructure templates
- ✅ AI-powered decision support
- ✅ Sample data and deployment scripts
- ✅ Local development environment

### What's NOT Included (By Design)
- ❌ Real-time government data integration (sample data only)
- ❌ User authentication system
- ❌ SMS/voice features (documented, not implemented)
- ❌ Production Google Maps integration (placeholder)
- ❌ Trained ML models (rule-based logic only)

### Next Steps for Production
1. Integrate real data sources (Agmarknet API)
2. Add user authentication
3. Implement SMS alert system
4. Add voice interface
5. Deploy to AWS with real data

See **[docs/deployment.md](docs/deployment.md)** for production deployment guide.

## 🤝 Contributing

This is a prototype project. For production deployment:
1. Integrate real data sources (Agmarknet, state APIs)
2. Add user authentication
3. Implement SMS/voice features
4. Add comprehensive testing
5. Set up CI/CD pipeline

## 📄 License

MIT

## 👥 Target Users

1. **Small farmers** - Low digital literacy, voice-first access
2. **Krushi Seva Kendra operators** - Dashboard users
3. **NGOs / agricultural officers** - Analytics viewers

## 🎯 Success Metrics

- 5,000 active farmers in 6 months
- 70% recommendation acceptance rate
- 5-10% price improvement for farmers
- 99% uptime, <2s response time

## ⚠️ Disclaimer

This platform provides information for guidance only and is not financial advice. Actual market prices may vary. Always verify current prices before making decisions.

---

**Built with ❤️ for Indian farmers**
