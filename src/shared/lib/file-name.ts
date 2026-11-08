// File name from a stored file URL or path ("…/storage/cvs/my-cv.pdf?x=1" → "my-cv.pdf").
export function getFileNameFromUrl(url: string | null | undefined) {
  if (!url) return '';
  const path = url.split('?')[0] ?? url;
  const name = path.split('/').pop() ?? '';

  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
