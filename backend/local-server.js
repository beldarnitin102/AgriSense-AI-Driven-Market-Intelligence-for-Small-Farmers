const http = require('http');

const PORT = 3001;

// Mock data
const mockRecommendation = {
  recommendation: "Sell Now",
  confidence: "High",
  explanation: "Cotton prices have dropped 8% in the last month. Current price of ₹6000 is still above the yearly average of ₹5700. Selling now is recommended before prices fall further.",
  priceRange: {
    min: 5800,
    max: 6200
  },
  averagePrice: 6000,
  trend: "Falling",
  historicalPrices: generateHistoricalPrices(),
  nearbyMandis: [
    {
      name: "Akola APMC",
      distance: 5.2,
      price: 6100,
      priceComparison: "↑ 5% above average",
      demand: "High",
      coordinates: { lat: 20.7002, lng: 77.0082 }
    },
    {
      name: "Nagpur Market",
      distance: 45.8,
      price: 6000,
      priceComparison: "→ at average",
      demand: "Medium",
      coordinates: { lat: 21.1458, lng: 79.0882 }
    },
    {
      name: "Amravati APMC",
      distance: 78.3,
      price: 5900,
      priceComparison: "↓ 3% below average",
      demand: "Low",
      coordinates: { lat: 20.9374, lng: 77.7796 }
    }
  ],
  userLocation: { lat: 20.7002, lng: 77.0082 }
};

function generateHistoricalPrices() {
  const prices = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const basePrice = 6000;
    const trend = -i * 1.5; // Falling trend
    const noise = Math.random() * 200 - 100;
    prices.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice + trend + noise)
    });
  }
  return prices;
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/recommendation' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received request:', data);

        // Customize response based on crop
        const response = { ...mockRecommendation };

        if (data.crop === 'wheat') {
          response.recommendation = "Wait 2-4 weeks";
          response.confidence = "Medium";
          response.explanation = "Wheat prices are rising steadily. Current price of ₹2200 is below the 3-month average of ₹2350. Waiting a few weeks may get you better prices.";
          response.trend = "Rising";
          response.averagePrice = 2200;
          response.priceRange = { min: 2100, max: 2400 };
        } else if (data.crop === 'rice') {
          response.recommendation = "Sell within 1-2 weeks";
          response.confidence = "Medium";
          response.explanation = "Rice market is stable. Current price of ₹2800 is close to the average of ₹2750. Selling within 1-2 weeks is a balanced choice.";
          response.trend = "Stable";
          response.averagePrice = 2800;
          response.priceRange = { min: 2700, max: 2900 };
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.url.startsWith('/analytics') && req.method === 'GET') {
    const analytics = {
      totalQueries: 1247,
      topCrops: [
        { crop: 'Cotton', queries: 456 },
        { crop: 'Soybean', queries: 342 },
        { crop: 'Wheat', queries: 289 },
        { crop: 'Onion', queries: 160 }
      ],
      priceComparison: {
        cotton: [
          { mandi: 'Akola', price: 6100 },
          { mandi: 'Nagpur', price: 6000 },
          { mandi: 'Amravati', price: 5900 }
        ]
      },
      recommendationStats: {
        sellNow: 45,
        wait: 30,
        sellSoon: 25
      }
    };
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(analytics));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 Mock Backend Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST http://localhost:${PORT}/recommendation`);
  console.log(`  GET  http://localhost:${PORT}/analytics`);
  console.log(`\nPress Ctrl+C to stop\n`);
});
