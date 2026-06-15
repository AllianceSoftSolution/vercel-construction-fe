import { useEffect, useMemo, useState } from "react";

export const DEFAULT_PAGE_SIZE = 10;

export function useClientPagination(data = [], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalItems = data?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 0);

  useEffect(() => {
    setPage(1);
  }, [totalItems, pageSize]);

  const safePage = Math.min(Math.max(page, 1), totalPages || 1);

  const paginatedData = useMemo(() => {
    if (!totalItems) return [];
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize, totalItems]);

  return {
    page: safePage,
    setPage,
    totalPages: totalItems ? totalPages : 0,
    totalItems,
    paginatedData,
    pageSize,
  };
}
