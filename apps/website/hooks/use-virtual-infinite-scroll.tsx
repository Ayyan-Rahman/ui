import { useEffect } from 'react';

import { useWindowVirtualizer } from '@tanstack/react-virtual';

import { PartialDeep } from 'type-fest';

export type VirtualContainerProps<T = unknown> = {
  data: PartialDeep<T>[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function useVirtualInfiniteScroll<T = unknown>({
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: VirtualContainerProps<T>) {
  const rowVirtualizer = useWindowVirtualizer({
    count: hasNextPage ? data.length + 1 : data.length,
    estimateSize: () => 77.5,
    overscan: 5,
  });

  const items = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (
      items.length &&
      items[items.length - 1].index > data.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, items, data.length]);

  return {
    rowVirtualizer,
    items,
  };
}
