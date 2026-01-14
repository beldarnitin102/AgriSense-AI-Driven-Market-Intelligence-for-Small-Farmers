#!/bin/bash

# Farmer Market Intelligence Platform - Setup Script

echo "=========================================="
echo "Farmer Market Intelligence Platform Setup"
echo "=========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✓ Node.js $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
    exit 1
fi
echo "✓ Python $(python3 --version)"

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "⚠️  AWS CLI is not installed. Install it for backend deployment."
else
    echo "✓ AWS CLI $(aws --version)"
fi

# Check SAM CLI
if ! command -v sam &> /dev/null; then
    echo "⚠️  AWS SAM CLI is not installed. Install it for backend deployment."
else
    echo "✓ AWS SAM CLI $(sam --version)"
fi

echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="

cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your API URL and Google Maps API key"
fi

cd ..

echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="

cd backend

# Install Python dependencies
echo "Installing backend dependencies..."
pip3 install -r requirements.txt

cd ..

echo ""
echo "=========================================="
echo "Generating Sample Data..."
echo "=========================================="

# Make script executable
chmod +x scripts/generate-sample-data.py

# Generate sample data
python3 scripts/generate-sample-data.py

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo ""
echo "1. Frontend Development:"
echo "   cd frontend"
echo "   npm run dev"
echo "   Open http://localhost:3000"
echo ""
echo "2. Backend Deployment:"
echo "   cd backend"
echo "   sam build"
echo "   sam deploy --guided"
echo ""
echo "3. Upload Sample Data to S3:"
echo "   aws s3 cp data/ s3://YOUR-BUCKET/ --recursive"
echo ""
echo "4. Configure Frontend:"
echo "   Update frontend/.env.local with your API Gateway URL"
echo ""
echo "For detailed instructions, see docs/deployment.md"
echo ""
