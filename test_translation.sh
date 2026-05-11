#!/bin/bash

echo "Testing translation endpoint..."
echo ""

curl -X POST "https://us-central1-career-counselling-6fac2.cloudfunctions.net/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","target":"hi"}' | python3 -m json.tool

echo ""
echo "Testing Hindi translation..."
curl -X POST "https://us-central1-career-counselling-6fac2.cloudfunctions.net/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Career Compass","target":"hi"}' | python3 -m json.tool

echo ""
echo "Testing Tamil translation..."
curl -X POST "https://us-central1-career-counselling-6fac2.cloudfunctions.net/translate" \
  -H "Content-Type: application/json" \
  -d '{"text":"Welcome","target":"ta"}' | python3 -m json.tool
