# Deployment Guide

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **AWS SAM CLI** installed
4. **Node.js 18+** for frontend
5. **Python 3.11+** for backend

## Backend Deployment

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Build SAM Application

```bash
sam build
```

### 3. Deploy to AWS

First deployment (guided):
```bash
sam deploy --guided
```

Follow prompts:
- Stack Name: `farmer-market-intelligence`
- AWS Region: `ap-south-1` (Mumbai)
- Confirm changes: Y
- Allow SAM CLI IAM role creation: Y
- Save arguments to config: Y

Subsequent deployments:
```bash
sam deploy
```

### 4. Upload Sample Data to S3

After deployment, get bucket name from outputs:
```bash
aws cloudformation describe-stacks \
  --stack-name farmer-market-intelligence \
  --query 'Stacks[0].Outputs[?OutputKey==`PriceDataBucketName`].OutputValue' \
  --output text
```

Upload data:
```bash
aws s3 cp data/sample-price-data.csv s3://YOUR-BUCKET/historical-prices/maharashtra/cotton_2025.csv
aws s3 cp data/sample-mandi-metadata.json s3://YOUR-BUCKET/mandi-metadata/maharashtra_mandis.json
```

### 5. Get API Endpoint

```bash
aws cloudformation describe-stacks \
  --stack-name farmer-market-intelligence \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text
```

## Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/prod
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Build Application

```bash
npm run build
```

### 4. Deploy to AWS Amplify

Option A: Using Amplify Console (Recommended)
1. Go to AWS Amplify Console
2. Connect your Git repository
3. Configure build settings (auto-detected for Next.js)
4. Add environment variables
5. Deploy

Option B: Using Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### 5. Test Deployment

Visit your Amplify URL and test the application.

## AWS Bedrock Setup

### 1. Enable Model Access

1. Go to AWS Bedrock Console
2. Navigate to "Model access"
3. Request access to "Claude 3 Haiku"
4. Wait for approval (usually instant)

### 2. Update Lambda IAM Role

Ensure Lambda execution role has Bedrock permissions:
```json
{
  "Effect": "Allow",
  "Action": [
    "bedrock:InvokeModel"
  ],
  "Resource": "*"
}
```

## Monitoring Setup

### 1. CloudWatch Dashboards

Create dashboard for monitoring:
- API Gateway requests and latency
- Lambda invocations and errors
- DynamoDB read/write capacity
- Bedrock API calls

### 2. CloudWatch Alarms

Set up alarms for:
- API error rate > 5%
- Lambda timeout rate > 2%
- DynamoDB throttling

### 3. Cost Monitoring

Enable AWS Cost Explorer and set budget alerts.

## Security Checklist

- [ ] S3 buckets are private (no public access)
- [ ] API Gateway has rate limiting enabled
- [ ] Lambda functions have minimal IAM permissions
- [ ] DynamoDB has encryption at rest enabled
- [ ] CloudTrail logging is enabled
- [ ] Secrets stored in AWS Secrets Manager (if any)

## Rollback Procedure

If deployment fails:

```bash
# Rollback SAM deployment
sam deploy --no-execute-changeset

# Or delete and redeploy
aws cloudformation delete-stack --stack-name farmer-market-intelligence
```

## Troubleshooting

### Lambda Function Errors

Check logs:
```bash
sam logs -n GetRecommendationFunction --tail
```

### API Gateway Issues

Test endpoint:
```bash
curl -X POST https://your-api-url/recommendation \
  -H "Content-Type: application/json" \
  -d '{"state":"maharashtra","crop":"cotton","location":"Akola","quantity":50}'
```

### Frontend Build Errors

Clear cache and rebuild:
```bash
rm -rf .next node_modules
npm install
npm run build
```

## Production Considerations

1. **Custom Domain**: Configure Route 53 and CloudFront
2. **SSL Certificate**: Use AWS Certificate Manager
3. **WAF**: Enable AWS WAF for API Gateway
4. **Backup**: Enable S3 versioning and DynamoDB backups
5. **Multi-Region**: Consider multi-region deployment for HA
