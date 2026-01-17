export function makeSafeFilename(title, fallback = "flyer") {
  const base = (title || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return base || fallback;
}
