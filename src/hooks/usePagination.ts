import { useState, useMemo, useCallback } from "react";

export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / pageSize);

  const currentPageItems = useMemo(
    () => items.slice(page * pageSize, (page + 1) * pageSize),
    [items, page, pageSize]
  );

  const hasPrev = page > 0;
  const hasNext = page + 1 < totalPages;

  const prevPage = useCallback(() => {
    if (hasPrev) setPage((p) => p - 1);
  }, [hasPrev]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((p) => p + 1);
  }, [hasNext]);

  const goToPage = useCallback((n: number) => {
    if (n >= 0 && n < totalPages) setPage(n);
  }, [totalPages]);

  return {
    page,
    totalPages,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    goToPage,
    currentPageItems,
  };
}
