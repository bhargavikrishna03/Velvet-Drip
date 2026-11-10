const FALLBACK = "https://placehold.co/600x400?text=Velvet+Drip";

export const optimizeImage = (url, width = 600) => {
  if (!url) return FALLBACK;
  if (url.startsWith("/")) return url; // your own files in /public: leave as is
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=75`;
};

export { FALLBACK };