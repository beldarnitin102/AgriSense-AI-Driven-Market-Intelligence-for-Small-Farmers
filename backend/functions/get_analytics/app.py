import json
import os
import boto3
from datetime import datetime, timedelta

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

BUCKET_NAME = os.environ['PRICE_DATA_BUCKET']
TABLE_NAME = os.environ['DYNAMODB_TABLE']

def lambda_handler(event, context):
    try:
        params = event.get('queryStringParameters', {})
        state = params.get('state', 'maharashtra')
        start_date = params.get('start', (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d'))
        end_date = params.get('end', datetime.now().strftime('%Y-%m-%d'))
        
        # Get analytics data
        analytics = {
            'totalQueries': get_total_queries(state, start_date, end_date),
            'topCrops': get_top_crops(state),
            'priceComparison': get_price_comparison(state),
            'recommendationStats': get_recommendation_stats(state)
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(analytics)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

def get_total_queries(state, start_date, end_date):
    """Get total queries for state in date range"""
    # Mock implementation
    return 1247

def get_top_crops(state):
    """Get most queried crops"""
    return [
        {'crop': 'Cotton', 'queries': 456},
        {'crop': 'Soybean', 'queries': 342},
        {'crop': 'Wheat', 'queries': 289},
        {'crop': 'Onion', 'queries': 160}
    ]

def get_price_comparison(state):
    """Get price comparison across mandis"""
    return {
        'cotton': [
            {'mandi': 'Akola', 'price': 6100},
            {'mandi': 'Nagpur', 'price': 6000},
            {'mandi': 'Amravati', 'price': 5900}
        ]
    }

def get_recommendation_stats(state):
    """Get recommendation statistics"""
    return {
        'sellNow': 45,
        'wait': 30,
        'sellSoon': 25
    }
