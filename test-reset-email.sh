#!/bin/bash

# Test script for password reset functionality

BASE_URL="http://localhost:3000"
EMAIL="habibecinar07@gmail.com"

echo "🚀 Testing Password Reset Flow..."

# Step 1: Register user (if not exists)
echo "📝 Step 1: Registering user..."
curl -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "'$EMAIL'",
    "password": "123456"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Step 2: Send reset email
echo "📧 Step 2: Sending reset email..."
RESPONSE=$(curl -s -X POST "$BASE_URL/auth/send-reset-email" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$EMAIL'"
  }')

echo "Response: $RESPONSE"

# Extract token from response
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
  echo "✅ Token received: $TOKEN"
  
  # Step 3: Reset password
  echo "🔐 Step 3: Resetting password..."
  curl -X POST "$BASE_URL/auth/reset-pwd" \
    -H "Content-Type: application/json" \
    -d '{
      "token": "'$TOKEN'",
      "password": "newpassword123"
    }' \
    -w "\nHTTP Status: %{http_code}\n\n"
else
  echo "❌ Token not found in response"
fi

echo "✨ Test completed!"
