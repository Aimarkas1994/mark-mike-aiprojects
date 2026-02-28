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
