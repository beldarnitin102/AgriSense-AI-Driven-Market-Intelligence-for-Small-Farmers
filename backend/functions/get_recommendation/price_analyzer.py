import json
import pandas as pd
from datetime import datetime, timedelta
from io import StringIO

class PriceAnalyzer:
    def __init__(self, s3_client, bucket_name):
        self.s3 = s3_client
        self.bucket = bucket_name
    
    def get_historical_prices(self, state, crop):
        """Fetch historical price data from S3"""
        try:
            year = datetime.now().year
            key = f"historical-prices/{state}/{crop}_{year}.csv"
            
            response = self.s3.get_object(Bucket=self.bucket, Key=key)
            csv_data = response['Body'].read().decode('utf-8')
            
            df = pd.read_csv(StringIO(csv_data))
            df['date'] = pd.to_datetime(df['date'])
            
            # Return last 12 months
            cutoff_date = datetime.now() - timedelta(days=365)
            df = df[df['date'] >= cutoff_date]
            
            return df.to_dict('records')
        except Exception as e:
            print(f"Error fetching price data: {e}")
            return self._get_mock_data(crop)
    
    def analyze_trends(self, price_data):
        """Analyze price trends and calculate statistics"""
        df = pd.DataFrame(price_data)
        
        if 'modal_price' not in df.columns:
            df['modal_price'] = df['price']
        
        prices = df['modal_price'].values
        
        # Calculate statistics
        current_price = prices[-1] if len(prices) > 0 else 0
        min_price = float(prices.min())
        max_price = float(prices.max())
        avg_price = float(prices.mean())
        std_price = float(prices.std())
        
        # Calculate moving averages
        if len(prices) >= 28:
            avg_4week = float(prices[-28:].mean())
        else:
            avg_4week = avg_price
            
        if len(prices) >= 84:
            avg_12week = float(prices[-84:].mean())
        else:
            avg_12week = avg_price
        
        # Detect trend
        trend_direction, trend_strength = self._detect_trend(avg_4week, avg_12week)
        
        # Calculate price percentile
        price_percentile = (prices < current_price).sum() / len(prices) * 100
        
        return {
            'current_price': float(current_price),
            'min_price': int(min_price),
            'max_price': int(max_price),
            'avg_price': int(avg_price),
            'std_price': float(std_price),
            'avg_4week': float(avg_4week),
            'avg_12week': float(avg_12week),
            'trend_direction': trend_direction,
            'trend_strength': trend_strength,
            'price_percentile': float(price_percentile)
        }
    
    def _detect_trend(self, avg_4week, avg_12week):
        """Detect price trend direction and strength"""
        change_pct = ((avg_4week - avg_12week) / avg_12week) * 100
        
        if change_pct > 5:
            direction = "Rising"
        elif change_pct < -5:
            direction = "Falling"
        else:
            direction = "Stable"
        
        if abs(change_pct) > 10:
            strength = "Strong"
        elif abs(change_pct) > 5:
            strength = "Moderate"
        else:
            strength = "Weak"
        
        return direction, strength
    
    def _get_mock_data(self, crop):
        """Generate mock price data for testing"""
        dates = pd.date_range(end=datetime.now(), periods=365, freq='D')
        base_price = 6000
        
        data = []
        for i, date in enumerate(dates):
            price = base_price + (i * 2) + ((-1) ** i * 100)
            data.append({
                'date': date.strftime('%Y-%m-%d'),
                'price': int(price),
                'modal_price': int(price)
            })
        
        return data
