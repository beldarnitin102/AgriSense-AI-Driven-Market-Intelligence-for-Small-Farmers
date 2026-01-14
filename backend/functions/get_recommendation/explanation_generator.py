import boto3
import json

class ExplanationGenerator:
    def __init__(self):
        self.bedrock = boto3.client('bedrock-runtime', region_name='us-east-1')
        self.model_id = 'anthropic.claude-3-haiku-20240307-v1:0'
    
    def generate_explanation(self, crop, state, analysis, recommendation):
        """Generate AI explanation using AWS Bedrock"""
        try:
            prompt = self._build_prompt(crop, state, analysis, recommendation)
            
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 150,
                "temperature": 0.3,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
            
            response = self.bedrock.invoke_model(
                modelId=self.model_id,
                body=json.dumps(request_body)
            )
            
            response_body = json.loads(response['body'].read())
            explanation = response_body['content'][0]['text']
            
            return explanation.strip()
            
        except Exception as e:
            print(f"Error generating explanation: {e}")
            return self._get_fallback_explanation(crop, analysis, recommendation)
    
    def _build_prompt(self, crop, state, analysis, recommendation):
        """Build prompt for LLM"""
        return f"""You are an agricultural advisor helping small farmers in India understand market conditions.

Context:
- Crop: {crop.title()}
- State: {state.title()}
- Current price: ₹{int(analysis['current_price'])} per quintal
- 12-week average price: ₹{int(analysis['avg_12week'])} per quintal
- Price trend: {analysis['trend_direction']} ({analysis['trend_strength']})
- Recommendation: {recommendation['action']}

Task: Explain in 2-3 simple sentences why this recommendation makes sense based on the data. Use simple language suitable for farmers with basic literacy. Do not make price predictions or guarantees.

Explanation:"""
    
    def _get_fallback_explanation(self, crop, analysis, recommendation):
        """Template-based fallback explanation"""
        trend = analysis['trend_direction'].lower()
        current = int(analysis['current_price'])
        average = int(analysis['avg_12week'])
        
        if recommendation['action'] == 'Sell Now':
            return f"{crop.title()} prices are {trend}. Current price of ₹{current} is good compared to recent average of ₹{average}. Selling now is recommended to secure good returns."
        elif 'Wait' in recommendation['action']:
            return f"{crop.title()} prices are {trend}. Current price of ₹{current} is below the recent average of ₹{average}. Waiting a few weeks may get you better prices."
        else:
            return f"{crop.title()} market is {trend}. Current price of ₹{current} is close to the average of ₹{average}. Selling within 1-2 weeks is a balanced choice."
