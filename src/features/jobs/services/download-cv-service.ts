import { getTimeZone } from '@/shared/lib/fetch-manager';

type DownloadCvParams = {
  url: string;
  fileName: string;
  locale: string;
  errorMessage: string;
};

// Goes through the app's own `/api/download-cv` route so the file keeps its name.
export async function downloadCv({
  url,
  fileName,
  locale,
  errorMessage,
}: DownloadCvParams) {
  const params = new URLSearchParams({ url, filename: fileName, locale });
  const response = await fetch(`/api/download-cv?${params.toString()}`, {
    headers: { 'X-Timezone': getTimeZone(), 'Accept-Language': locale },
  });
  if (!response.ok) throw new Error(errorMessage);

  const objectUrl = window.URL.createObjectURL(await response.blob());
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
}
