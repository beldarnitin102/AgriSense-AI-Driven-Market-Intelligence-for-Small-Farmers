#!/usr/bin/env python3
"""
Generate sample historical price data for testing
"""

import pandas as pd
from datetime import datetime, timedelta
import random
import json

def generate_price_data(state, crop, days=365):
    """Generate sample price data"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    dates = pd.date_range(start=start_date, end=end_date, freq='D')
    
    # Base price varies by crop
    base_prices = {
        'cotton': 6000,
        'soybean': 4500,
        'wheat': 2200,
        'rice': 2800,
        'onion': 1500
    }
    
    base_price = base_prices.get(crop.lower(), 5000)
    
    data = []
    for i, date in enumerate(dates):
        # Add trend and seasonality
        trend = i * 2  # Slight upward trend
        seasonal = 200 * (1 + 0.5 * (i % 90) / 90)  # Seasonal variation
        noise = random.randint(-150, 150)
        
        modal_price = int(base_price + trend + seasonal + noise)
        min_price = int(modal_price * 0.95)
        max_price = int(modal_price * 1.05)
        volume = random.randint(800, 1500)
        
        data.append({
            'date': date.strftime('%Y-%m-%d'),
            'mandi_name': 'Sample Mandi',
            'mandi_code': 'MH001',
            'crop': crop.title(),
            'variety': 'Standard',
            'min_price': min_price,
            'max_price': max_price,
            'modal_price': modal_price,
            'volume_quintals': volume
        })
    
    return pd.DataFrame(data)

def generate_mandi_metadata(state):
    """Generate sample mandi metadata"""
    mandis = {
        'maharashtra': [
            {
                'code': 'MH001',
                'name': 'Akola APMC',
                'district': 'Akola',
                'latitude': 20.7002,
                'longitude': 77.0082,
                'crops_traded': ['Cotton', 'Soybean', 'Wheat'],
                'facilities': ['weighbridge', 'storage'],
                'contact': '+91-724-xxx-xxxx',
                'operating_days': ['Monday', 'Tuesday', 'Wednesday', 'Friday']
            },
            {
                'code': 'MH002',
                'name': 'Nagpur Market',
                'district': 'Nagpur',
                'latitude': 21.1458,
                'longitude': 79.0882,
                'crops_traded': ['Cotton', 'Wheat', 'Onion'],
                'facilities': ['weighbridge', 'cold_storage'],
                'contact': '+91-712-xxx-xxxx',
                'operating_days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            }
        ],
        'karnataka': [
            {
                'code': 'KA001',
                'name': 'Bangalore APMC',
                'district': 'Bangalore',
                'latitude': 12.9716,
                'longitude': 77.5946,
                'crops_traded': ['Rice', 'Ragi', 'Vegetables'],
                'facilities': ['weighbridge', 'cold_storage', 'grading'],
                'contact': '+91-80-xxx-xxxx',
                'operating_days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            }
        ]
    }
    
    return {
        'state': state.title(),
        'mandis': mandis.get(state.lower(), [])
    }

if __name__ == '__main__':
    # Generate price data for Maharashtra cotton
    print("Generating sample price data...")
    df = generate_price_data('maharashtra', 'cotton', days=365)
    df.to_csv('data/generated-price-data.csv', index=False)
    print(f"Generated {len(df)} records")
    
    # Generate mandi metadata
    print("Generating mandi metadata...")
    for state in ['maharashtra', 'karnataka']:
        metadata = generate_mandi_metadata(state)
        with open(f'data/{state}_mandis.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        print(f"Generated metadata for {state}")
    
    print("Done!")
