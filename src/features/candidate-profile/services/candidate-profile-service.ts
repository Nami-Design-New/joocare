import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";
import type { CandidateProfileApiUser } from "../types/profile.types";

function resolveStoredFileUrl(path: string | null | undefined) {
    if (!path) {
        return null;
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const trimmedPath = path.trim().replace(/^\/+/, "");
    const normalizedPath = trimmedPath.startsWith("storage/")
        ? trimmedPath.slice("storage/".length)
        : trimmedPath;

    return `https://joocare.nami-tec.com/storage/${normalizedPath}`;
}

export async function getCandidateProfileService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await apiFetch(`${getUserApiUrl()}/auth/profile`, {
        method: "GET",
        locale,
        token,
    });


    if (!res.ok) {
        return null;
    }

    return res.data?.data
}
