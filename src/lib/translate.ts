// Preferred: configure the endpoint via Vite env (see .env)
const TRANSLATE_ENDPOINT =
  import.meta.env.VITE_TRANSLATE_ENDPOINT || "/api/translate";

// Local storage key for translation cache
const CACHE_KEY_PREFIX = "translate_cache_";
const CACHE_VERSION = "v1"; // Increment to invalidate old caches

type TranslationResponse = {
  translated?: string;
};

/**
 * Get cached translation from localStorage (FREE & INSTANT!)
 */
function getCachedTranslation(text: string, target: string): string | null {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${CACHE_VERSION}_${target}_${text.slice(
      0,
      100
    )}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { translation, timestamp } = JSON.parse(cached);
      // Cache expires after 7 days
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return translation;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
}

/**
 * Save translation to localStorage for future use (FREE!)
 */
function setCachedTranslation(
  text: string,
  target: string,
  translation: string
) {
  try {
    const cacheKey = `${CACHE_KEY_PREFIX}${CACHE_VERSION}_${target}_${text.slice(
      0,
      100
    )}`;
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        translation,
        timestamp: Date.now(),
      })
    );
  } catch {
    // Ignore localStorage errors (quota exceeded, etc.)
  }
}

export async function translateText(
  text: string,
  target: string
): Promise<string> {
  // Check local cache first (FREE & INSTANT!)
  const cached = getCachedTranslation(text, target);
  if (cached) {
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout (faster)

    const res = await fetch(TRANSLATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("translateText: HTTP error", res.status, errorText);

      // Show user-friendly error for common issues
      if (res.status === 503 || res.status === 504) {
        console.warn("Translation service is warming up, please try again");
      } else if (res.status === 429) {
        console.warn("Too many translation requests, please wait");
      }

      return text;
    }

    const data = await res.json().catch((e) => {
      console.error("translateText: failed to parse JSON", e);
      return {} as TranslationResponse;
    });

    const translated = (data as TranslationResponse).translated || text;

    // Cache the translation for future use (FREE!)
    setCachedTranslation(text, target, translated);

    return translated;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        console.error("translateText: request timed out after 10s");
      } else {
        console.error("translateText: network error", err.message);
      }
    } else {
      console.error("translateText: unknown error", err);
    }
    return text;
  }
}
