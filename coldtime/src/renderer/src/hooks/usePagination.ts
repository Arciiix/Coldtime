import { useMemo } from "react";

interface PaginationResult<T> {
  currentPageData: T[];
  totalPages: number;
}

export function usePagination<T>(
  data: T[],
  currentPage: number,
  pageSize: number
): PaginationResult<T> {
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const currentPageData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const totalPages = Math.ceil(data.length / pageSize);

  return { currentPageData, totalPages };
}
