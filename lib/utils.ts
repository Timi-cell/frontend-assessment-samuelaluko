// Format large numbers with locale separators 
export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// Extract release year from TMDB date string e.g. "2008-07-18" → "2008"
export function getReleaseYear(dateStr: string): string {
  return dateStr ? dateStr.split("-")[0]! : "Unknown";
}

// Format vote average to 1 decimal place e.g. 8.967 → "8.9" 
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Clamp a number between min and max 
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Format runtime minutes into "2h 28m" format 
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
