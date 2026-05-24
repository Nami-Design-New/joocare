// lib/metadata.ts
import { settingService } from "@/shared/services/settings-services";

function getMetadataBase() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) return undefined;
    try { return new URL(siteUrl); } catch { return undefined; }
}

export async function getSharedOgImage(locale: string): Promise<string> {
    const metadataBase = getMetadataBase();
    const settings = await settingService(locale); // ✅ من الكاش
    const rawImage = settings?.share_link_image || "/tab-icon.png";

    return rawImage.startsWith("http")
        ? rawImage
        : metadataBase
            ? new URL(rawImage, metadataBase).toString()
            : rawImage;
}