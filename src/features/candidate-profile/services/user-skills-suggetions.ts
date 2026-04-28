import { getUserApiUrl } from "@/shared/lib/api-endpoints";
import { apiFetch } from "@/shared/lib/fetch-manager";

export async function getUserSkillsSuggestionsService({
    token,
    locale,
}: {
    token: string;
    locale: string;
}) {
    const res = await apiFetch(`${getUserApiUrl()}/suggested/user-skills`, {
        method: "GET",
        locale,
        token,
    });
    // console.log("res:::: ", res);

    return res.data?.data?.suggested;
}