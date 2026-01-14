# Infrastructure

This directory contains AWS infrastructure configuration and deployment templates.

## Architecture Components

### Compute
- **AWS Lambda**: Serverless functions for API endpoints
  - `GetRecommendationFunction`: Main recommendation engine
  - `GetAnalyticsFunction`: Analytics data aggregation

### API
- **API Gateway**: REST API with CORS enabled
  - Rate limiting: 100 requests/hour per user
  - API key authentication

### Storage
- **Amazon S3**: Historical price data and mandi metadata
  - Versioning enabled
  - Private access only
  - Lifecycle policies for cost optimization

- **Amazon DynamoDB**: Query logs and user data
  - On-demand capacity mode
  - TTL enabled (90 days)
  - Point-in-time recovery

### AI/ML
- **AWS Bedrock**: Claude 3 Haiku for explanation generation
  - Temperature: 0.3 (deterministic)
  - Max tokens: 150
  - Fallback to template-based explanations

### Monitoring
- **CloudWatch**: Logs, metrics, and alarms
- **X-Ray**: Distributed tracing (optional)

## Cost Estimation

Based on 10,000 queries/month:

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| Lambda | 10K invocations, 512MB, 5s avg | $0.50 |
| API Gateway | 10K requests | $0.04 |
| DynamoDB | 10K writes, 5K reads | $1.50 |
| S3 | 1GB storage, 10K requests | $0.10 |
| Bedrock | 10K requests, 150 tokens | $3.00 |
| **Total** | | **~$5.14/month** |

## Scaling Considerations

- Lambda: Auto-scales to 1000 concurrent executions
- API Gateway: 10,000 requests/second limit
- DynamoDB: On-demand scales automatically
- S3: Unlimited storage and requests

## Security

- All data encrypted in transit (TLS 1.3)
- S3 and DynamoDB encrypted at rest
- IAM roles with least privilege
- VPC endpoints for private communication (optional)
- CloudTrail audit logging enabled

## Disaster Recovery

- S3 versioning for data recovery
- DynamoDB point-in-time recovery (35 days)
- CloudFormation stack for infrastructure recreation
- Multi-AZ deployment by default

## Future Enhancements

- CloudFront CDN for global distribution
- ElastiCache for caching layer
- SageMaker for ML model training
- Step Functions for complex workflows
- EventBridge for event-driven architecture
