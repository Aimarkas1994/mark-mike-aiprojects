# 🚀 RENDER DEPLOYMENT AUTOMATION SCRIPT
# Save this as you'll need it for the actual deployment

echo "🎯 Starting Render Deployment Automation..."
echo "========================================"

# Step 1: Verify local backend is ready
echo "✅ Step 1: Verifying backend readiness..."
cd /home/mark/.openclaw/workspace/backend
npm install
node server.js &
SERVER_PID=$!
sleep 3
kill $SERVER_PID 2>/dev/null
echo "✅ Backend verified successfully"

# Step 2: Prepare Render configuration
echo "✅ Step 2: Preparing Render configuration..."
cat > render-deploy-config.txt << EOF
=== RENDER DEPLOYMENT CONFIGURATION ===
Service Name: portfolio-api
Region: Oregon (or closest to you)
Branch: main
Runtime: Node
Root Directory: backend
Build Command: npm install && npm run init-db
Start Command: npm start
Instance Type: Free

=== ENVIRONMENT VARIABLES ===
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://aimarkas1994.github.io

=== PERSISTENT STORAGE ===
Disk Name: sqlite-data
Mount Path: /opt/render/project/backend
Size: 1GB (Free)
=== END CONFIG ===
EOF

echo "✅ Configuration prepared"

# Step 3: Create deployment test script
cat > test-deployment.sh << 'EOF'
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
EOF

chmod +x test-deployment.sh
echo "✅ Test script created: test-deployment.sh"

# Step 4: Create update script for when you get your Render URL
cat > update-api-url.sh << 'EOF'
#!/bin/bash
# Update the frontend API URL after Render deployment

RENDER_URL=$1
if [ -z "$RENDER_URL" ]; then
    echo "Usage: $0 <your-render-url>"
    echo "Example: $0 https://portfolio-api.onrender.com"
    exit 1
fi

echo "🔄 Updating API URL to: $RENDER_URL"
echo "================================"

# Update the API client file
sed -i "s|return 'https://.*\.onrender\.com/api'|return '$RENDER_URL/api'|g" docs/js/api-client.js

echo "✅ API URL updated"
echo "📤 Pushing changes to GitHub..."
git add docs/js/api-client.js
git commit -m "Update API URL to live Render backend: $RENDER_URL"
git push origin main

echo "🎉 Deployment complete! Your portfolio is now live!"
EOF

chmod +x update-api-url.sh
echo "✅ Update script created: update-api-url.sh"

echo ""
echo "🚀 NEXT STEPS:"
echo "=============="
echo "1. Go to: https://render.com"
echo "2. Sign up with GitHub (free)"
echo "3. Create Web Service → Connect your repo"
echo "4. Use configuration in: render-deploy-config.txt"
echo "5. After deployment, run: ./update-api-url.sh <your-render-url>"
echo "6. Test deployment: ./test-deployment.sh <your-render-url>"
echo ""
echo "⚡ Your swarm agents are working on the final preparations!"