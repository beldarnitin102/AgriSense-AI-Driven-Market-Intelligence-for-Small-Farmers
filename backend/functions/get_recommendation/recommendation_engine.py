class RecommendationEngine:
    def generate_recommendation(self, analysis):
        """Generate recommendation based on rule-based logic"""
        current_price = analysis['current_price']
        avg_12week = analysis['avg_12week']
        trend_direction = analysis['trend_direction']
        trend_strength = analysis['trend_strength']
        price_percentile = analysis['price_percentile']
        
        # Rule 1: Falling trend + high current price
        if trend_direction == "Falling" and current_price > avg_12week * 1.05:
            return {
                'action': 'Sell Now',
                'confidence': 'High',
                'reason': 'Prices are declining but still above average'
            }
        
        # Rule 2: Rising trend + low current price
        if trend_direction == "Rising" and current_price < avg_12week * 0.95:
            return {
                'action': 'Wait 2-4 weeks',
                'confidence': 'Medium',
                'reason': 'Prices are rising and currently below average'
            }
        
        # Rule 3: Price at yearly high
        if price_percentile > 85:
            return {
                'action': 'Sell Now',
                'confidence': 'High',
                'reason': 'Current price is near yearly high'
            }
        
        # Rule 4: Strong rising trend
        if trend_direction == "Rising" and trend_strength == "Strong":
            return {
                'action': 'Wait 2-4 weeks',
                'confidence': 'Medium',
                'reason': 'Strong upward trend suggests better prices ahead'
            }
        
        # Rule 5: Stable market
        if trend_direction == "Stable" and 0.95 < (current_price / avg_12week) < 1.05:
            return {
                'action': 'Sell within 1-2 weeks',
                'confidence': 'Medium',
                'reason': 'Market is stable, no strong signal to wait'
            }
        
        # Default rule
        return {
            'action': 'Sell within 1-2 weeks',
            'confidence': 'Low',
            'reason': 'Market conditions are unclear, moderate timing suggested'
        }
