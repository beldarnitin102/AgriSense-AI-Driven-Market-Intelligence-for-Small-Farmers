import json
import os
import boto3
from datetime import datetime, timedelta
from recommendation_engine import RecommendationEngine
from price_analyzer import PriceAnalyzer
from mandi_finder import MandiFinder
from explanation_generator import ExplanationGenerator

s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

BUCKET_NAME = os.environ['PRICE_DATA_BUCKET']
TABLE_NAME = os.environ['DYNAMODB_TABLE']

def lambda_handler(event, context):
    try:
        body = json.loads(event['body'])
        
        state = body['state']
        crop = body['crop']
        location = body['location']
        quantity = body['quantity']
        
        # Initialize components
        price_analyzer = PriceAnalyzer(s3, BUCKET_NAME)
        recommendation_engine = RecommendationEngine()
        mandi_finder = MandiFinder(s3, BUCKET_NAME)
        explanation_generator = ExplanationGenerator()
        
        # Get historical price data
        price_data = price_analyzer.get_historical_prices(state, crop)
        
        # Analyze trends
        analysis = price_analyzer.analyze_trends(price_data)
        
        # Generate recommendation
        recommendation = recommendation_engine.generate_recommendation(analysis)
        
        # Find nearby mandis
        mandis = mandi_finder.find_nearby_mandis(state, location, crop)
        
        # Generate AI explanation
        explanation = explanation_generator.generate_explanation(
            crop, state, analysis, recommendation
        )
        
        # Prepare response
        response_data = {
            'recommendation': recommendation['action'],
            'confidence': recommendation['confidence'],
            'explanation': explanation,
            'priceRange': {
                'min': analysis['min_price'],
                'max': analysis['max_price']
            },
            'averagePrice': analysis['avg_price'],
            'trend': analysis['trend_direction'],
            'historicalPrices': price_data[-90:],  # Last 90 days
            'nearbyMandis': mandis,
            'userLocation': {'lat': 20.7002, 'lng': 77.0082}  # Mock location
        }
        
        # Log query to DynamoDB
        log_query(body, response_data)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(response_data)
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

def log_query(request, response):
    table = dynamodb.Table(TABLE_NAME)
    timestamp = int(datetime.now().timestamp())
    
    table.put_item(
        Item={
            'userId': 'anonymous',
            'timestamp': timestamp,
            'state': request['state'],
            'crop': request['crop'],
            'location': request['location'],
            'quantity': request['quantity'],
            'recommendation': response['recommendation'],
            'confidence': response['confidence'],
            'ttl': timestamp + (90 * 24 * 60 * 60)  # 90 days TTL
        }
    )
