export const normalizeStream = (stream?: string, name?: string) => {
  const value = `${stream || ""} ${name || ""}`.toLowerCase().trim();

  if (value.match(/jee|engineering|btech|gate|vit|bits/)) return "Engineering";
  if (value.match(/neet|medical|mbbs|aiims|nursing/)) return "Medical";
  if (value.match(/cat|mba|management|xat|snap/)) return "Management";
  if (value.match(/clat|law|llb/)) return "Law";
  if (value.match(/design|nid|nift|fashion/)) return "Design";
  if (value.match(/upsc|ssc|railway|defence|nda|cds|government/)) return "Government";

  return "Others";
};

export const streamToSlug = (stream: string) =>
  stream
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
