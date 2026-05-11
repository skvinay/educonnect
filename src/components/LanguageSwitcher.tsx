import { useTranslation } from "react-i18next";

// const languages = [
//   { code: "en", label: "English" },
//   { code: "hi", label: "हिन्दी" },
//   { code: "mr", label: "मराठी" },
//   { code: "ta", label: "தமிழ்" },
//   { code: "bn", label: "বাংলা" },
//   { code: "kn", label: "ಕನ್ನಡ" },
// ];

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" }, // Hindi ✅
  { code: "bn", label: "বাংলা" }, // Bengali ✅
  { code: "te", label: "తెలుగు" }, // Telugu ✅
  { code: "mr", label: "मराठी" }, // Marathi ✅
  { code: "ta", label: "தமிழ்" }, // Tamil ✅
  { code: "ur", label: "اردو" }, // Urdu ✅
  { code: "gu", label: "ગુજરાતી" }, // Gujarati ✅
  { code: "kn", label: "ಕನ್ನಡ" }, // Kannada ✅
  { code: "ml", label: "മലയാളം" }, // Malayalam ✅
  { code: "or", label: "ଓଡ଼ିଆ" }, // Odia ✅
  { code: "pa", label: "ਪੰਜਾਬੀ" }, // Punjabi ✅
  { code: "as", label: "অসমীয়া" }, // Assamese ✅
  { code: "ne", label: "नेपाली" }, // Nepali ✅
  { code: "sd", label: "سنڌي" }, // Sindhi ✅
  { code: "sa", label: "संस्कृतम्" }, // Sanskrit ✅
  // Removed: mai, sat, ks, kok, mni, brx, doi (not supported by Google Translate)
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      className="border rounded-md px-2 py-1 bg-white text-black"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {languages.map((lng) => (
        <option key={lng.code} value={lng.code}>
          {lng.label}
        </option>
      ))}
    </select>
  );
}
