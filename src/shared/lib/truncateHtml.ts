export function truncateHtml(html: string, maxLength = 70) {
    if (!html) return "";

    // نحول HTML لنص عادي
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";

    // نقطع النص
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
}