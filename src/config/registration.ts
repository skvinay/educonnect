export const REGISTRATION_CONFIG = {
  apiUrl: import.meta.env.VITE_REGISTRATION_API_URL || "",
  studentApiUrl: import.meta.env.VITE_STUDENT_REGISTRATION_API_URL || "",
  influencerApiUrl: import.meta.env.VITE_INFLUENCER_REGISTRATION_API_URL || "",
  exhibitorApiUrl: import.meta.env.VITE_EXHIBITOR_REGISTRATION_API_URL || "",
  whatsappConfirmationMessage: "Your registration is confirmed",
};
