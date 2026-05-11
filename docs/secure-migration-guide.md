# Secure Firebase + Google Cloud Migration Guide

## Target architecture

### Frontend

- Vite + React served from Firebase Hosting
- Firebase Web SDK for Auth, App Check, and public content reads
- Frontend-safe `VITE_*` variables only

### Backend

- Firebase Functions for `/api/ai-chat` and `/api/translate`
- Gemini API key stored only in backend runtime config
- Cloud Translation uses default Cloud Function credentials
- No service account JSON files anywhere in the repo

### Protection layers

- Restricted CORS by allowed origin
- Firebase Auth required for AI chat
- App Check recommended for production clients
- In-memory rate limiting for sensitive endpoints
- Hosting rewrites hide direct function URLs from app code

## Migration checklist

1. Create a **new** Google Cloud project and Firebase project
2. Enable only required services:
   - Firebase Hosting
   - Firebase Authentication
   - Realtime Database and/or Firestore
   - Cloud Functions
   - Cloud Build
   - Artifact Registry
   - Cloud Translation API
   - Gemini / Generative Language API
3. Revoke all old service account keys in the suspended project
4. Rotate any old Gemini/API keys
5. Copy `.env.example` to `.env` and fill in the new Firebase web config
6. Configure backend runtime values securely:
   - `GEMINI_API_KEY`
   - `ALLOWED_ORIGINS`
   - `FIREBASE_DATABASE_URL` for local admin scripts if needed
7. Enable Google Sign-In in Firebase Auth
8. Configure App Check with reCAPTCHA v3
9. Deploy rules:

```bash
firebase use <new-project-id>
firebase deploy --only firestore:rules,database,storage
```

10. Deploy hosting and functions:

```bash
firebase deploy --only hosting,functions
```

## Required manual Firebase console steps

1. Create the new Firebase project
2. Register the web app and copy config values into `.env`
3. Enable Google provider in Authentication
4. Create Realtime Database and/or Firestore
5. Apply Storage rules
6. Enable App Check and create a reCAPTCHA v3 site key
7. Set production custom domain in Hosting
8. Configure backend secret/env management before deployment

## Safe deployment checklist

- [ ] No `.env` values committed with real secrets
- [ ] No service account JSON files exist in workspace
- [ ] No private keys remain in source files
- [ ] Gemini key only exists in backend runtime configuration
- [ ] Frontend bundle contains no privileged secrets
- [ ] Auth required for AI chat
- [ ] Translation endpoint restricted by origin and rate limiting
- [ ] App Check configured for production
- [ ] Rules deployed for Firestore / RTDB / Storage
- [ ] Old project credentials revoked
- [ ] Git history cleanup completed separately

## Recommended production architecture

1. **Frontend** → Firebase Hosting
2. **Auth** → Firebase Authentication (Google Sign-In)
3. **Public content** → RTDB `/prod` or Firestore public docs with read-only rules
4. **AI chat** → `/api/ai-chat` → Firebase Function → Gemini API
5. **Translation** → `/api/translate` → Firebase Function → Cloud Translation API
6. **Protection** → Auth + App Check + restricted CORS + rate limiting

## Final security audit summary

This workspace has been prepared for migration by:

- removing browser-side Gemini usage
- removing old inline Firebase config from `index.html`
- replacing hardcoded Firebase config with env-driven frontend-safe config
- removing the committed `scripts/serviceAccountKey.json` file
- adding Firebase rules and safer hosting/function config

### Still required outside the codebase

- revoke exposed credentials in the old project
- rotate old API keys
- rewrite git history to purge old secrets
- create and configure the new Firebase/GCP project
