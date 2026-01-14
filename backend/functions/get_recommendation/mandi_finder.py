import json
from geopy.distance import geodesic

class MandiFinder:
    def __init__(self, s3_client, bucket_name):
        self.s3 = s3_client
        self.bucket = bucket_name
    
    def find_nearby_mandis(self, state, location, crop):
        """Find nearby mandis within 100km"""
        try:
            key = f"mandi-metadata/{state}_mandis.json"
            response = self.s3.get_object(Bucket=self.bucket, Key=key)
            mandi_data = json.loads(response['Body'].read().decode('utf-8'))
            
            user_coords = self._get_location_coords(location)
            nearby_mandis = []
            
            for mandi in mandi_data['mandis']:
                if crop.lower() not in [c.lower() for c in mandi.get('crops_traded', [])]:
                    continue
                
                mandi_coords = (mandi['latitude'], mandi['longitude'])
                distance = geodesic(user_coords, mandi_coords).km
                
                if distance <= 100:
                    nearby_mandis.append({
                        'name': mandi['name'],
                        'distance': round(distance, 1),
                        'price': self._get_mandi_price(mandi['code']),
                        'priceComparison': self._get_price_comparison(),
                        'demand': self._get_demand_indicator(),
                        'coordinates': {
                            'lat': mandi['latitude'],
                            'lng': mandi['longitude']
                        }
                    })
            
            # Sort by distance
            nearby_mandis.sort(key=lambda x: x['distance'])
            return nearby_mandis[:10]
            
        except Exception as e:
            print(f"Error finding mandis: {e}")
            return self._get_mock_mandis()
    
    def _get_location_coords(self, location):
        """Get coordinates for location (mock implementation)"""
        # In production, use geocoding service
        return (20.7002, 77.0082)  # Akola, Maharashtra
    
    def _get_mandi_price(self, mandi_code):
        """Get latest price for mandi (mock implementation)"""
        import random
        return random.randint(5800, 6300)
    
    def _get_price_comparison(self):
        """Compare price with average (mock implementation)"""
        import random
        diff = random.randint(-10, 15)
        if diff > 0:
            return f"↑ {diff}% above average"
        else:
            return f"↓ {abs(diff)}% below average"
    
    def _get_demand_indicator(self):
        """Get demand indicator (mock implementation)"""
        import random
        return random.choice(['High', 'Medium', 'Low'])
    
    def _get_mock_mandis(self):
        """Generate mock mandi data for testing"""
        return [
            {
                'name': 'Akola APMC',
                'distance': 5.2,
                'price': 6100,
                'priceComparison': '↑ 5% above average',
                'demand': 'High',
                'coordinates': {'lat': 20.7002, 'lng': 77.0082}
            },
            {
                'name': 'Nagpur Market',
                'distance': 45.8,
                'price': 6000,
                'priceComparison': '→ at average',
                'demand': 'Medium',
                'coordinates': {'lat': 21.1458, 'lng': 79.0882}
            },
            {
                'name': 'Amravati APMC',
                'distance': 78.3,
                'price': 5900,
                'priceComparison': '↓ 3% below average',
                'demand': 'Low',
                'coordinates': {'lat': 20.9374, 'lng': 77.7796}
            }
        ]
