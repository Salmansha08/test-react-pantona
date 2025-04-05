/**
 * Generates a complete URL for an image based on its relative path
 * @param imagePath Relative image path (usually starts with /storage/)
 * @returns Complete URL accessible by the browser, or null if no path is provided
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith('http')) return imagePath;

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  const baseUrlParts = baseUrl.split("/api");
  const baseUrlDomain = baseUrlParts.length > 0 ? baseUrlParts[0] : "";

  return `${baseUrlDomain}${imagePath}`;
}