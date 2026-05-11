import { API_ENDPOINTS } from "@/config/apiConfig";

export type FormType = "student" | "influencer" | "exhibitor";

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

type SubmissionPayload = {
  form_type: FormType;
  honeypot?: string;
  utm?: UtmParams;
  [key: string]: unknown;
};

type ApiResponse = {
  status?: string;
  message?: string;
};

const normalizeTransportValue = (value: unknown): string => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  if (value == null) {
    return "";
  }

  return String(value);
};

const toTransportPayload = (
  payload: SubmissionPayload
): Record<string, string> => {
  const transport: Record<string, string> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (
      key === "utm" &&
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      const utm = value as Record<string, unknown>;
      for (const [utmKey, utmValue] of Object.entries(utm)) {
        transport[utmKey] = normalizeTransportValue(utmValue);
      }
      continue;
    }

    transport[key] = normalizeTransportValue(value);
  }

  return transport;
};

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export const getUtmParams = (search: string): UtmParams => {
  const params = new URLSearchParams(search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
  };
};

const duplicateKey = (formType: FormType) =>
  `educonnect_registration_${formType}`;

const payloadFingerprint = (payload: SubmissionPayload): string => {
  const ordered = Object.keys(payload)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      if (key !== "honeypot") {
        acc[key] = payload[key];
      }
      return acc;
    }, {});
  return JSON.stringify(ordered);
};

const checkDuplicate = (payload: SubmissionPayload) => {
  const storageKey = duplicateKey(payload.form_type);
  const saved = sessionStorage.getItem(storageKey);
  const fingerprint = payloadFingerprint(payload);

  if (!saved) return;

  try {
    const parsed = JSON.parse(saved) as { fingerprint: string; ts: number };
    if (
      parsed.fingerprint === fingerprint &&
      Date.now() - parsed.ts < DUPLICATE_WINDOW_MS
    ) {
      throw new Error(
        "Duplicate submission detected. Please wait before submitting again."
      );
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Duplicate submission")
    ) {
      throw error;
    }
    // ignore storage parse errors
  }
};

const cacheSubmission = (payload: SubmissionPayload) => {
  sessionStorage.setItem(
    duplicateKey(payload.form_type),
    JSON.stringify({
      fingerprint: payloadFingerprint(payload),
      ts: Date.now(),
    })
  );
};

export const submitRegistration = async (payload: SubmissionPayload) => {
  const apiUrl = API_ENDPOINTS[payload.form_type];
  const transportPayload = toTransportPayload(payload);
  const isGoogleAppsScriptEndpoint = /script\.google\.com\/macros\/s\//i.test(
    apiUrl || ""
  );

  const isPlaceholderUrl = apiUrl?.includes("REPLACE_WITH_");
  const isValidHttpUrl = /^https?:\/\//i.test(apiUrl || "");

  if (!apiUrl || isPlaceholderUrl || !isValidHttpUrl) {
    throw new Error("Registration API URL is not configured.");
  }

  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    throw new Error("Spam detected.");
  }

  checkDuplicate(payload);

  const params = new URLSearchParams();
  Object.entries(transportPayload).forEach(([key, value]) => {
    params.append(key, value ?? "");
  });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Apps Script should return JSON like: {"status":"success"}
    const result = (await response.json()) as ApiResponse;
    if (result?.status && result.status !== "success") {
      throw new Error(result.message || "Submission failed");
    }
  } catch (error) {
    console.error("FORM ERROR: registration request failed", {
      formType: payload.form_type,
      apiUrl,
      error,
      isGoogleAppsScriptEndpoint,
    });
    throw new Error("Failed to submit form");
  }

  cacheSubmission(payload);
};

export const createWhatsAppRedirectUrl = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/?text=${encodedMessage}`;
};
