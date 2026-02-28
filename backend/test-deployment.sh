#!/bin/bash
# Test your Render deployment

API_URL=$1
if [ -z "$API_URL" ]; then
    echo "Usage: $0 <your-render-url>"
    echo "Example: $0 https://portfolio-api.onrender.com"
    exit 1
fi

echo "🧪 Testing Render deployment at: $API_URL"
echo "========================================"

# Test health endpoint
echo "Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$API_URL/health")
if [ "$HEALTH_RESPONSE" == "200" ]; then
    echo "✅ Health check PASSED"
else
    echo "❌ Health check FAILED: $HEALTH_RESPONSE"
fi

# Test API endpoint
echo "Testing API endpoint..."
API_RESPONSE=$(curl -s -w "%{http_code}" "$API_URL/api/health")
if [ "$API_RESPONSE" == "200" ]; then
    echo "✅ API health check PASSED"
else
    echo "❌ API health check FAILED: $API_RESPONSE"
fi

# Test projects endpoint
echo "Testing projects endpoint..."
PROJECTS_RESPONSE=$(curl -s -w "%{http_code}" "$API_URL/api/projects")
if [ "$PROJECTS_RESPONSE" == "200" ]; then
    echo "✅ Projects endpoint PASSED"
else
    echo "❌ Projects endpoint FAILED: $PROJECTS_RESPONSE"
fi

echo "🎯 Deployment testing complete!"
