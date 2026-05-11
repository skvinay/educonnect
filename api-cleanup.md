# API Cleanup Guide

## ❌ APIs to DISABLE (Not Used / 100% Errors):

### 1. **Cloud Scheduler API** (14 requests, 100% errors)
- **Status**: Not being used, all requests failing
- **Reason**: You don't have any scheduled jobs
- **Disable**: ✅ Safe to disable

### 2. **Cloud Pub/Sub API** (12 requests, 100% errors)
- **Status**: Not being used, all requests failing
- **Reason**: You're not using Pub/Sub messaging
- **Disable**: ✅ Safe to disable

### 3. **Gemini for Google Cloud API** (2 requests)
- **Status**: Minimal usage
- **Reason**: You're not using Gemini AI features
- **Disable**: ✅ Safe to disable

### 4. **Cloud Runtime Configuration API** (1 request, 100% error)
- **Status**: DEPRECATED by Google
- **Reason**: Old API, replaced by other services
- **Disable**: ✅ Safe to disable

---

## ✅ APIs You MUST KEEP (Essential):

### Core Translation Services:
1. **Cloud Translation API** (301 requests) - Your translation service
2. **Cloud Functions API** (378 requests) - Runs your translate function
3. **Cloud Run Admin API** (3 requests) - Cloud Functions Gen2 backend

### Build & Deploy:
4. **Cloud Build API** (7 requests) - Builds your functions
5. **Artifact Registry API** (107 requests, 42% errors) - Stores container images
   - Note: 42% errors might need investigation

### Monitoring & Auth:
6. **Cloud Logging API** (360 requests) - Function logs
7. **Identity Toolkit API** (21 requests) - Firebase Auth (if you use it)
8. **Token Service API** (7 requests) - Authentication tokens
9. **IAM API** (8 requests) - Permission management

### Infrastructure:
10. **Compute Engine API** (7 requests) - Cloud Functions infrastructure
11. **Cloud Firestore API** (7 requests, 28% errors) - Database (if you use it)

---

## ⚠️ APIs to INVESTIGATE (High Error Rate):

1. **Artifact Registry API** (42% errors)
   - Needed but has errors - might indicate build issues

2. **Cloud Firestore API** (28% errors)
   - Are you using Firestore? If not, can disable
   - If yes, investigate the errors

---

## 💰 Estimated Monthly Savings:

Disabling unused APIs won't directly save money (APIs are free until you use them), but it will:
- ✅ Reduce confusion in dashboards
- ✅ Improve security (fewer attack surfaces)
- ✅ Cleaner billing reports

---

## 🔧 How to Disable APIs:

### Via Google Cloud Console:
```
Visit: https://console.cloud.google.com/apis/dashboard?project=career-counselling-6fac2

For each unused API:
1. Click on the API name
2. Click "DISABLE API"
3. Confirm
```

### Via gcloud CLI:
```bash
# Disable Cloud Scheduler
gcloud services disable cloudscheduler.googleapis.com

# Disable Pub/Sub
gcloud services disable pubsub.googleapis.com

# Disable Gemini
gcloud services disable generativelanguage.googleapis.com

# Disable Runtime Configuration (deprecated)
gcloud services disable runtimeconfig.googleapis.com
```
