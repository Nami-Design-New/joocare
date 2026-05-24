// shared/utils/metadata.ts
import { headers } from "next/headers";

export async function getMetadataBase(): Promise<URL> {
    const headersList = await headers();
    const host = headersList.get("host") || "www.joocare.com";
    const protocol = "https";

    return new URL(`${protocol}://${host}`);
}