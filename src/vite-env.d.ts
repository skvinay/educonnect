/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_APPCHECK_SITE_KEY?: string;
  readonly VITE_AI_CHAT_ENDPOINT?: string;
  readonly VITE_TRANSLATE_ENDPOINT?: string;
  readonly VITE_STUDENT_REGISTRATION_API_URL?: string;
  readonly VITE_INFLUENCER_REGISTRATION_API_URL?: string;
  readonly VITE_EXHIBITOR_REGISTRATION_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
