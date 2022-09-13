import { useInfiniteQuery } from '@tanstack/react-query';

import { TOKENS } from '@gateway/theme';

import { ViewModule, ViewList } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Stack } from '@mui/material';

import { categoriesMap } from '../../../../../constants/dao';
import { usePropertyFilter } from '../../../../../hooks/use-property-filter';
import { useViewMode, ViewMode } from '../../../../../hooks/use-view-modes';
import { gqlAnonMethods } from '../../../../../services/api';
import { ChipDropdown } from '../../../../molecules/chip-dropdown';
import { GridView } from './grid-view';
import { TableView } from './table-view';

export function DaosTab() {
  const { view, toggleView } = useViewMode();
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(
      ['people-tab'],
      ({ pageParam = 0 }) => gqlAnonMethods.daos_tab({ offset: pageParam }),
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.daos.length < 15) return undefined;
          return pages.length * 15;
        },
      }
    );

  const daos = data?.pages?.flatMap((page) => page.daos) ?? [];

  const {
    selectedFilters,
    filteredItems: filteredDaos,
    availableFilters,
    toggleFilter,
    onClear,
  } = usePropertyFilter(daos ?? [], 'categories', categoriesMap);

  return (
    <Box sx={{ py: 4 }}>
      {isLoading ? (
        <Box
          key="loading"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mb: 4, px: TOKENS.CONTAINER_PX }}
            key="daos-tab-filters"
          >
            <ChipDropdown
              label="Categories"
              values={availableFilters}
              selected={selectedFilters}
              onToggle={toggleFilter}
              onClear={onClear}
            />
            <IconButton
              type="button"
              onClick={toggleView}
              color="secondary"
              aria-label="Toggle View"
            >
              {view === ViewMode.grid ? <ViewList /> : <ViewModule />}
            </IconButton>
          </Stack>
          {view === ViewMode.grid && (
            <GridView
              {...{
                hasNextPage,
                isFetchingNextPage,
                fetchNextPage,
                data: filteredDaos,
              }}
            ></GridView>
          )}
          {view === ViewMode.table && (
            <TableView
              {...{
                hasNextPage,
                isFetchingNextPage,
                fetchNextPage,
                data: filteredDaos,
              }}
            />
          )}
        </>
      )}
    </Box>
  );
}
