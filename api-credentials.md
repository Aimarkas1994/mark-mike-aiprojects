# Stock & Crypto Analysis Dashboard - API Credentials

## Free API Keys and Configuration

This dashboard uses completely free APIs for real-time stock and cryptocurrency data.

### 🚀 ACTIVE FREE APIS:

#### 1. Alpha Vantage (Stock Data)
**Website:** https://www.alphavantage.co/
**Free Tier:** 25 requests/day, 5 requests/minute
**Status:** ✅ ACTIVE - Currently using demo key

**Getting Your Free API Key:**
1. Go to: https://www.alphavantage.co/support/#api-key
2. Fill out the form with your name and email
3. You'll receive a free API key instantly
4. Replace 'demo' in the dashboard code with your actual key

**Current Demo Key:** `demo` (limited functionality)
**Your Free Key:** `[ADD YOUR KEY HERE]`

#### 2. CoinGecko API (Cryptocurrency Data)
**Website:** https://www.coingecko.com/en/api
**Free Tier:** 10-50 calls/minute, no monthly limit
**Status:** ✅ ACTIVE - No API key required for basic usage

**Features:**
- Real-time cryptocurrency prices
- Market data, charts, historical data
- Exchange rates, trading volume
- No authentication required for basic endpoints

**Rate Limits:**
- 10 calls/minute for public endpoints
- 50 calls/minute for demo plan (free)
- No hard monthly caps

#### 3. Yahoo Finance API (Alternative Stock Data)
**Status:** ⚠️ UNSTABLE - Free but unofficial
**Alternative:** Use Alpha Vantage (more reliable)

### 🔧 DASHBOARD CONFIGURATION:

#### File Structure:
```
/home/mark/.openclaw/workspace/
├── stock-crypto-dashboard.html     # Main dashboard
├── api-credentials.md             # This file (API info)
├── sentiment-analyzer.html        # Project 2 (coming soon)
└── portfolio-optimizer.html       # Project 3 (coming soon)
```

#### Current Setup:
- **Stock Data:** Alpha Vantage (demo key)
- **Crypto Data:** CoinGecko (no key needed)
- **Technical Analysis:** Client-side JavaScript
- **Charting:** Chart.js (free)
- **Storage:** Browser localStorage

### 📊 FEATURES IMPLEMENTED:

#### ✅ PROJECT 1 - Advanced Stock & Crypto Analysis Dashboard:
- **Real-time price tracking** (stocks & crypto)
- **Technical indicators:** RSI, SMA, MACD
- **Trend analysis:** AI-powered trend detection
- **Watchlist:** Save favorite symbols
- **Interactive charts:** Time series with zoom
- **Mobile responsive:** Works on all devices
- **Data validation:** Error handling and limits

### 🔄 NEXT STEPS:

#### Replace Demo API Key:
1. Get your free Alpha Vantage key: https://www.alphavantage.co/support/#api-key
2. Edit the dashboard file:
   ```javascript
   const API_CONFIG = {
       alphaVantage: {
           key: 'YOUR_FREE_KEY_HERE', // Replace 'demo'
           baseUrl: 'https://www.alphavantage.co/query'
       }
   };
   ```

#### Coming Soon:
- **Project 2:** AI-Powered Market Sentiment Analyzer
- **Project 3:** Portfolio Optimization Tool

### 💡 TIPS:

#### For Better Performance:
- Cache data locally to reduce API calls
- Use longer time intervals for updates
- Implement rate limiting in your code
- Consider multiple API keys for higher limits

#### For Production Use:
- Sign up for Alpha Vantage premium ($29.99/month for higher limits)
- Use CoinGecko demo plan for better crypto API limits
- Consider professional APIs like Polygon.io or IEX Cloud for serious applications

### 📞 SUPPORT:

#### Alpha Vantage Support:
- Website: https://www.alphavantage.co/
- Documentation: https://www.alphavantage.co/documentation/
- API Key Support: support@alphavantage.co

#### CoinGecko Support:
- Website: https://www.coingecko.com/en/api
- Documentation: https://www.coingecko.com/api/docs
- Discord: https://discord.gg/coinbase

---

**Last Updated:** March 1, 2026  
**Status:** ✅ All APIs working with free tier  
**Next Update:** Project 2 - Sentiment Analyzer development

**Note:** This dashboard is designed to work with completely free APIs. No payment required to get started!