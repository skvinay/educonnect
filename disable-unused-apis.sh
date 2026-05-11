#!/bin/bash

echo "🗑️  Disabling unused APIs..."
echo ""

# Array of APIs to disable
apis=(
    "cloudscheduler.googleapis.com"
    "pubsub.googleapis.com" 
    "generativelanguage.googleapis.com"
    "runtimeconfig.googleapis.com"
)

for api in "${apis[@]}"; do
    echo "Disabling $api..."
    gcloud services disable "$api" --force 2>&1 | grep -v "WARNING" || true
done

echo ""
echo "✅ Done! Unused APIs have been disabled."
echo ""
echo "To verify, run: gcloud services list --enabled"
