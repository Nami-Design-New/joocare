import type { InfiniteData } from "@tanstack/react-query";

type PageRecord = Record<string, unknown>;
type InfinitePageData = InfiniteData<PageRecord>;

function isPageRecord(value: unknown): value is PageRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isInfinitePageData(value: unknown): value is InfinitePageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as { pages?: unknown };
  return Array.isArray(candidate.pages) && candidate.pages.every(isPageRecord);
}

function updatePageItems<T>(
  page: PageRecord,
  collectionKeys: string[],
  updater: (items: T[]) => T[],
): PageRecord {
  for (const key of collectionKeys) {
    if (Array.isArray(page[key])) {
      return {
        ...page,
        [key]: updater(page[key] as T[]),
      };
    }
  }

  if (Array.isArray(page.data)) {
    return {
      ...page,
      data: updater(page.data as T[]),
    };
  }

  if (page.data && typeof page.data === "object") {
    const nestedData = page.data as Record<string, unknown>;

    for (const key of collectionKeys) {
      if (Array.isArray(nestedData[key])) {
        return {
          ...page,
          data: {
            ...nestedData,
            [key]: updater(nestedData[key] as T[]),
          },
        };
      }
    }

    if (Array.isArray(nestedData.data)) {
      return {
        ...page,
        data: {
          ...nestedData,
          data: updater(nestedData.data as T[]),
        },
      };
    }
  }

  return {
    ...page,
    data: updater([]),
  };
}

export function prependInfiniteItem<T>(
  current: unknown,
  collectionKeys: string[],
  item: T,
): InfinitePageData | undefined {
  if (!isInfinitePageData(current)) {
    return undefined;
  }

  return {
    ...current,
    pages: current.pages.map((page, index) =>
      index === 0 ? updatePageItems<T>(page, collectionKeys, (items) => [item, ...items]) : page,
    ),
  };
}

export function replaceInfiniteItem<T extends { id: string }>(
  current: unknown,
  collectionKeys: string[],
  item: T,
): InfinitePageData | undefined {
  if (!isInfinitePageData(current)) {
    return undefined;
  }

  return {
    ...current,
    pages: current.pages.map((page) =>
      updatePageItems<T>(page, collectionKeys, (items) =>
        items.map((currentItem) => (currentItem.id === item.id ? item : currentItem)),
      ),
    ),
  };
}

export function removeInfiniteItem<T extends { id: string }>(
  current: unknown,
  collectionKeys: string[],
  id: string,
): InfinitePageData | undefined {
  if (!isInfinitePageData(current)) {
    return undefined;
  }

  return {
    ...current,
    pages: current.pages.map((page) =>
      updatePageItems<T>(page, collectionKeys, (items) =>
        items.filter((currentItem) => currentItem.id !== id),
      ),
    ),
  };
}
