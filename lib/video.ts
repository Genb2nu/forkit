// ============================================================
// ForkIt — Video Utilities
// ============================================================

export function detectVideoType(url: string): 'youtube' | 'facebook' | null {
  if (!url) return null;
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/facebook\.com|fb\.com|fb\.watch/.test(url)) return 'facebook';
  return null;
}

export function buildEmbedUrl(url: string): string {
  const type = detectVideoType(url);
  if (type === 'youtube') {
    const id = url.match(/(?:embed\/|v=|youtu\.be\/)([^&?/\s]+)/)?.[1];
    return id
      ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
      : url;
  }
  if (type === 'facebook') {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=500`;
  }
  return url;
}
