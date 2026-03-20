export function isVideo(url: string | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
}
