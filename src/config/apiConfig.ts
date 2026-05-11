export const API_ENDPOINTS = {
  student: import.meta.env.VITE_STUDENT_REGISTRATION_API_URL || "",
  exhibitor: import.meta.env.VITE_EXHIBITOR_REGISTRATION_API_URL || "",
  influencer: import.meta.env.VITE_INFLUENCER_REGISTRATION_API_URL || "",
} as const;
