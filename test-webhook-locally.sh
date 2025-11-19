#!/bin/bash

# Test Shopify Webhook Locally
# This simulates a Shopify order webhook to test your endpoint

echo "🧪 Testing Shopify Webhook Endpoint"
echo "===================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Error: Next.js dev server not running"
    echo "   Start it with: npm run dev"
    echo ""
    exit 1
fi

echo "✅ Next.js server is running"
echo ""

# Get a real referral code from database
echo "📝 Getting a test referral code from database..."
echo ""

# You'll need to replace TEST_CODE with an actual code from your database
# Run this in Supabase SQL Editor first:
# SELECT referral_code FROM users LIMIT 1;

REFERRAL_CODE="TEST_CODE"  # Replace with actual code from database

echo "Using referral code: $REFERRAL_CODE"
echo ""
echo "⚡ Sending test webhook request..."
echo ""

# Send test webhook
response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST http://localhost:3000/api/webhooks/shopify/order \
  -H "Content-Type: application/json" \
  -d "{
    \"id\": 999888777,
    \"order_number\": 1001,
    \"total_price\": \"189.00\",
    \"customer\": {
      \"id\": \"123456789\",
      \"email\": \"webhook-test-$(date +%s)@example.com\",
      \"first_name\": \"Test\",
      \"last_name\": \"Customer\",
      \"phone\": \"+1234567890\"
    },
    \"note_attributes\": [
      {
        \"name\": \"referral_code\",
        \"value\": \"$REFERRAL_CODE\"
      }
    ]
  }")

# Extract HTTP code
http_code=$(echo "$response" | grep "HTTP_CODE" | cut -d':' -f2)
response_body=$(echo "$response" | grep -v "HTTP_CODE")

echo "Response:"
echo "$response_body" | jq . 2>/dev/null || echo "$response_body"
echo ""
echo "HTTP Status: $http_code"
echo ""

# Check result
if [ "$http_code" = "200" ]; then
    echo "✅ Webhook test PASSED!"
    echo ""
    echo "Next steps:"
    echo "1. Check Supabase for new user and commission records"
    echo "2. Check wallet balances were updated"
    echo "3. Deploy to production and set up real Shopify webhook"
else
    echo "❌ Webhook test FAILED!"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check your terminal where 'npm run dev' is running for errors"
    echo "2. Verify environment variables in .env.local"
    echo "3. Run: node verify-supabase.js"
    echo "4. Make sure $REFERRAL_CODE exists in database"
fi

echo ""
