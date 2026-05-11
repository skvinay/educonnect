import hashlib
import os
import time
from collections import defaultdict, deque

import firebase_admin
import requests
from firebase_admin import auth as admin_auth
from firebase_functions import https_fn
from flask import jsonify, make_response
from google.cloud.translate_v2 import Client

SUPPORTED_LANGS = [
    "hi",  # Hindi
    "bn",  # Bengali
    "te",  # Telugu
    "mr",  # Marathi
    "ta",  # Tamil
    "ur",  # Urdu
    "gu",  # Gujarati
    "kn",  # Kannada
    "ml",  # Malayalam
    "or",  # Odia
    "pa",  # Punjabi
    "as",  # Assamese
    "ne",  # Nepali
    "sd",  # Sindhi
    "sa",  # Sanskrit
]

if not firebase_admin._apps:
    firebase_admin.initialize_app()

SYSTEM_INSTRUCTION = """
You are Vidya, an expert Indian career counsellor helping students explore the best options after Grade 10 and Grade 12.
Give practical, direct, student-friendly advice.
Focus on Indian education pathways.
Suggest streams, entrance exams, degrees, and career outcomes.
Keep answers structured and concise.
If the student seems confused, offer 2-3 best-fit options with reasons.
""".strip()

# In-memory cache to avoid duplicate API calls (persists during warm instances)
_translation_cache = {}

_rate_buckets = defaultdict(deque)

# Initialize Google Translate client (lazy loaded)
_translate_client = None


def get_allowed_origins():
    raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
    return {origin.strip() for origin in raw.split(",") if origin.strip()}


def get_request_origin(req: https_fn.Request):
    origin = req.headers.get("Origin", "")
    return origin if origin in get_allowed_origins() else ""


def apply_cors_headers(response, origin: str):
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response


def handle_preflight(req: https_fn.Request):
    origin = get_request_origin(req)
    if not origin:
        response = make_response("Origin not allowed", 403)
        return apply_cors_headers(response, "")
    response = make_response("", 204)
    return apply_cors_headers(response, origin)


def enforce_origin(req: https_fn.Request):
    origin = get_request_origin(req)
    if not origin:
        response = jsonify({"error": "Origin not allowed"})
        return response, 403, ""
    return None, None, origin


def check_rate_limit(bucket_name: str, key: str, limit: int, window_seconds: int):
    now = time.time()
    bucket = _rate_buckets[(bucket_name, key)]
    while bucket and now - bucket[0] > window_seconds:
        bucket.popleft()
    if len(bucket) >= limit:
        return False
    bucket.append(now)
    return True


def get_client_key(req: https_fn.Request, fallback: str = "anonymous"):
    forwarded_for = req.headers.get("X-Forwarded-For", "")
    ip = forwarded_for.split(",")[0].strip() if forwarded_for else fallback
    return ip or fallback


def verify_bearer_token(req: https_fn.Request):
    auth_header = req.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None, (jsonify({"error": "Missing bearer token"}), 401)

    token = auth_header.replace("Bearer ", "", 1).strip()
    if not token:
        return None, (jsonify({"error": "Missing bearer token"}), 401)

    try:
        decoded = admin_auth.verify_id_token(token)
        return decoded, None
    except Exception:
        return None, (jsonify({"error": "Invalid auth token"}), 401)


def build_gemini_contents(messages):
    contents = []
    for message in messages:
        role = message.get("role")
        if role not in ["user", "model"]:
            continue
        parts = message.get("parts") or []
        normalized_parts = []
        for part in parts:
            text = (part or {}).get("text", "")
            if text:
                normalized_parts.append({"text": text[:2000]})
        if normalized_parts:
            contents.append({"role": role, "parts": normalized_parts})
    return contents[-24:]


def call_gemini(messages):
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-flash:generateContent?key={api_key}"
    )
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
        "contents": build_gemini_contents(messages),
        "generationConfig": {
            "temperature": 0.6,
            "maxOutputTokens": 800,
        },
    }

    response = requests.post(url, json=payload, timeout=20)
    response.raise_for_status()
    data = response.json()
    candidates = data.get("candidates") or []
    if not candidates:
        return ""

    parts = ((candidates[0].get("content") or {}).get("parts") or [])
    text_parts = [part.get("text", "") for part in parts if part.get("text")]
    return "\n".join(text_parts).strip()


def get_translate_client():
    """Lazy load the translate client."""
    global _translate_client
    if _translate_client is None:
        _translate_client = Client()
    return _translate_client


def get_cache_key(text: str, target: str) -> str:
    """Generate a cache key for text + target language."""
    # Use hash to keep keys short and handle long text
    text_hash = hashlib.md5(text.encode()).hexdigest()
    return f"{target}:{text_hash}"


@https_fn.on_request(memory=256, timeout_sec=60)
def translate(req: https_fn.Request):
    """Secure translation endpoint using default function credentials."""

    if req.method == "OPTIONS":
        return handle_preflight(req)

    error_response, status_code, origin = enforce_origin(req)
    if error_response is not None:
        return apply_cors_headers(error_response, origin), status_code

    if req.method != "POST":
        response = jsonify({"error": "Method not allowed"})
        return apply_cors_headers(response, origin), 405

    client_key = get_client_key(req)
    if not check_rate_limit("translate", client_key, limit=60, window_seconds=60):
        response = jsonify({"error": "Rate limit exceeded"})
        return apply_cors_headers(response, origin), 429

    data = req.get_json(silent=True) or {}

    text = data.get("text", "").strip()
    target = data.get("target")

    if not text or not target:
        response = jsonify({"error": "Missing parameters"})
        return apply_cors_headers(response, origin), 400

    if len(text) > 500:
        response = jsonify({"error": "Text too long"})
        return apply_cors_headers(response, origin), 400

    if target not in SUPPORTED_LANGS:
        response = jsonify({"error": f"Unsupported language: {target}"})
        return apply_cors_headers(response, origin), 400

    # Check cache first (FREE!)
    cache_key = get_cache_key(text, target)
    if cache_key in _translation_cache:
        print(f"Cache HIT for {target} (saved API call!)")
        api_response = jsonify({"translated": _translation_cache[cache_key]})
        return apply_cors_headers(api_response, origin)

    try:
        # Call Google Translate API (costs money)
        print(f"Cache MISS - calling Google Translate API for {target}")
        client = get_translate_client()

        result = client.translate(text, target_language=target, source_language="en")

        translated = result.get("translatedText", text)

        # Store in cache for future requests
        _translation_cache[cache_key] = translated

        # Limit cache size to prevent memory issues (keep last 1000 translations)
        if len(_translation_cache) > 1000:
            # Remove oldest 20% of entries
            keys_to_remove = list(_translation_cache.keys())[:200]
            for key in keys_to_remove:
                del _translation_cache[key]

        api_response = jsonify({"translated": translated})
        return apply_cors_headers(api_response, origin)

    except Exception as e:
        print(f"Translation error: {e}")
        api_response = jsonify({"translated": text, "error": str(e)})
        return apply_cors_headers(api_response, origin), 500


@https_fn.on_request(memory=512, timeout_sec=60)
def career_chat(req: https_fn.Request):
    """Authenticated Gemini proxy to keep model access server-side only."""

    if req.method == "OPTIONS":
        return handle_preflight(req)

    error_response, status_code, origin = enforce_origin(req)
    if error_response is not None:
        return apply_cors_headers(error_response, origin), status_code

    if req.method != "POST":
        response = jsonify({"error": "Method not allowed"})
        return apply_cors_headers(response, origin), 405

    decoded_token, auth_error = verify_bearer_token(req)
    if auth_error:
        response, status = auth_error
        return apply_cors_headers(response, origin), status

    uid = decoded_token.get("uid", "anonymous")
    if not check_rate_limit("career_chat", uid, limit=20, window_seconds=300):
        response = jsonify({"error": "Rate limit exceeded"})
        return apply_cors_headers(response, origin), 429

    data = req.get_json(silent=True) or {}
    messages = data.get("messages") or []

    if not isinstance(messages, list) or not messages:
        response = jsonify({"error": "Messages are required"})
        return apply_cors_headers(response, origin), 400

    try:
        text = call_gemini(messages)
        response = jsonify(
            {
                "text": text or "I'm sorry, I couldn't generate a response right now. Please try again.",
                "audio": "",
            }
        )
        return apply_cors_headers(response, origin)
    except requests.HTTPError as exc:
        status = exc.response.status_code if exc.response is not None else 502
        response = jsonify({"error": f"Gemini request failed with status {status}"})
        return apply_cors_headers(response, origin), status
    except Exception as exc:
        response = jsonify({"error": str(exc) or "AI chat failed"})
        return apply_cors_headers(response, origin), 500
