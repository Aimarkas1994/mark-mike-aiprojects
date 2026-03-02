#!/bin/bash

# Quick Deployment Verification Script
# 
# This script performs basic post-deployment verification tests
# Usage: ./quick-verify.sh https://your-service.onrender.com

set -e

API_URL="$1"

if [[ -z "$API_URL" ]]; then
    echo "❌ Error: API URL is required"
    echo "Usage: $0 https://your-service.onrender.com"
    exit 1
fi

# Clean URL to ensure it ends with /api
if [[ "$API_URL" == */api ]]; then
    CLEAN_URL="$API_URL"
    SERVICE_URL="${API_URL%/api}"
else
    CLEAN_URL="${API_URL}/api"
    SERVICE_URL="$API_URL"
fi

echo "🚀 Quick Deployment Verification"
echo "📡 Service URL: $SERVICE_URL"
echo "🔗 API URL: $CLEAN_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_code="${3:-200}"
    
    echo -n "🧪 Testing $name... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" -m 10 "$url" 2>/dev/null || echo "000")
    
    if [[ "$response_code" == "$expected_code" ]]; then
        echo -e "${GREEN}✅ PASSED ($response_code)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED ($response_code)${NC}"
        return 1
    fi
}

# Counter for failed tests
FAILED_TESTS=0
TOTAL_TESTS=0

# Test function that increments counters
run_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if ! test_endpoint "$@"; then
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Run tests
echo "🩺 Health Checks"
echo "==============="
run_test "Service Health" "$SERVICE_URL/health"
run_test "API Health" "$CLEAN_URL/health"
echo ""

echo "📡 API Endpoints"
echo "==============="
run_test "Get Projects" "$CLEAN_URL/projects"
run_test "Get Skills" "$CLEAN_URL/skills"
run_test "Get Contact Messages" "$CLEAN_URL/contact"
run_test "Get Blog Posts" "$CLEAN_URL/blog"
echo ""

echo "🔗 Specific Queries"
echo "=================="
run_test "Get Featured Projects" "$CLEAN_URL/projects?featured=true"
run_test "Get Frontend Skills" "$CLEAN_URL/skills?category=Frontend"
echo ""

echo "⚡ Performance Tests"
echo "=================="
echo -n "🧪 Testing Response Time... "
response_time=$(curl -s -w "%{time_total}" -o /dev/null -m 10 "$CLEAN_URL/health" 2>/dev/null || echo "10.000")
response_time_ms=$(echo "$response_time * 1000" | bc -l 2>/dev/null || echo "10000")

if (( $(echo "$response_time_ms < 5000" | bc -l 2>/dev/null || echo 1) )); then
    if (( $(echo "$response_time_ms < 1000" | bc -l 2>/dev/null || echo 1) )); then
        echo -e "${GREEN}✅ EXCELLENT (${response_time_ms%.*}ms)${NC}"
    elif (( $(echo "$response_time_ms < 3000" | bc -l 2>/dev/null || echo 1) )); then
        echo -e "${GREEN}✅ GOOD (${response_time_ms%.*}ms)${NC}"
    else
        echo -e "${YELLOW}⚠️  ACCEPTABLE (${response_time_ms%.*}ms)${NC}"
    fi
else
    echo -e "${RED}❌ TOO SLOW (${response_time_ms%.*}ms)${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))
echo ""

echo "📊 Test Results"
echo "=============="
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: $((TOTAL_TESTS - FAILED_TESTS))/${TOTAL_TESTS}"
echo -e "Failed: ${RED}$FAILED_TESTS${RED}/${TOTAL_TESTS}"

if [[ $FAILED_TESTS -eq 0 ]]; then
    echo ""
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo "✅ Your deployment is working correctly!"
    echo "🚀 Ready for production use!"
    exit 0
else
    echo ""
    echo -e "${RED}❌ $FAILED_TESTS TESTS FAILED!${NC}"
    echo "⚠️  Please check your deployment and fix the issues above."
    exit 1
fi