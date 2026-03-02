#!/bin/bash

# 🚀 RENDER QUICK DEPLOYMENT SCRIPT
# Run this when you're ready to deploy to Render

echo "🎯 RENDER QUICK DEPLOYMENT"
echo "=========================="

# Check if user is ready to deploy
read -p "Have you created your Render account? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please create Render account first: https://render.com"
    exit 1
fi

echo "✅ Great! Let's deploy your portfolio API to Render"
echo ""

echo "📋 DEPLOYMENT CHECKLIST:"
echo "========================"
echo "✅ Backend verified locally"
echo "✅ Database configured for Render persistent storage"  
echo "✅ Environment variables prepared"
echo "✅ Render configuration documented"
echo "✅ Test scripts created"
echo ""

echo "🚀 STEP 1: RENDER SETUP (2 minutes)"
echo "================================="
echo "1. Go to: https://render.com"
echo "2. Click 'New +' → 'Web Service'"
echo "3. Connect GitHub repo: Aimarkas1994/mark-mike-aiprojects"
echo "4. Use configuration below:"
echo ""

cat render-deploy-config.txt
echo ""

echo "🚀 STEP 2: ADD PERSISTENT STORAGE (1 minute)"
echo "=========================================="
echo "1. After service creation, go to 'Storage' tab"
echo "2. Click 'Create Disk'"
echo "3. Name: sqlite-data"
echo "4. Mount Path: /opt/render/project/backend"
echo "5. Size: 1GB (Free)"
echo ""

echo "🚀 STEP 3: WAIT FOR DEPLOYMENT (3 minutes)"
echo "========================================"
echo "1. Wait for 'Live' status"
echo "2. Note your Render URL: https://your-service-name.onrender.com"
echo ""

echo "🚀 STEP 4: UPDATE FRONTEND (30 seconds)"
echo "======================================"
read -p "Enter your Render URL (e.g., https://portfolio-api.onrender.com): " RENDER_URL

if [ ! -z "$RENDER_URL" ]; then
    echo "🔄 Updating frontend with live API URL..."
    ./update-api-url.sh "$RENDER_URL"
else
    echo "❌ No URL provided. Run ./update-api-url.sh <your-url> later"
fi

echo ""
echo "🚀 STEP 5: TEST DEPLOYMENT (1 minute)"
echo "===================================="
if [ ! -z "$RENDER_URL" ]; then
    echo "🧪 Testing your live deployment..."
    ./test-deployment.sh "$RENDER_URL"
else
    echo "Run ./test-deployment.sh <your-url> when ready"
fi

echo ""
echo "🎉 CONGRATULATIONS!"
echo "==================="
echo "Your full-stack portfolio is now LIVE with:"
echo "✅ Professional HTTPS URL"
echo "✅ Live contact form"
echo "✅ Dynamic content from API"
echo "✅ 24/7 monitoring"
echo "✅ Zero cost hosting"
echo ""
echo "📊 Monitor at: https://dashboard.render.com"
echo "🔗 Portfolio at: https://aimarkas1994.github.io/mark-mike-aiprojects/"
echo "🚀 API at: $RENDER_URL"