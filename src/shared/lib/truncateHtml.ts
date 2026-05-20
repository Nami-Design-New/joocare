export function truncateHtml(html: string, maxLength = 70) {
  if (!html) return "";

  const text = htmlToText(html);

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function htmlToText(html: string) {
  if (!html) return "";

  // Remove script/style blocks first, then strip tags.
  const withoutBlocks = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");

  const withoutTags = withoutBlocks.replace(/<[^>]*>/g, " ");

  // Decode a small, common subset of entities (enough for previews/excerpts).
  const decoded = withoutTags.replace(
    /&(nbsp|amp|lt|gt|quot|#39);/gi,
    (match, entity) => {
      switch (String(entity).toLowerCase()) {
        case "nbsp":
          return " ";
        case "amp":
          return "&";
        case "lt":
          return "<";
        case "gt":
          return ">";
        case "quot":
          return '"';
        case "#39":
          return "'";
        default:
          return match;
      }
    },
  );

  return decoded.replace(/\s+/g, " ").trim();
}
