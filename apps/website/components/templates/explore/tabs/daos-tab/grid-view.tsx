import { TOKENS } from '@gateway/theme';

import { Box } from '@mui/material';

import { Daos } from '../../../../../services/graphql/types.generated';
import { DaoCard } from '../../../../molecules/dao-card';

import {
  useVirtualInfiniteScroll,
  VirtualContainerProps,
} from '../../../../../hooks/use-virtual-infinite-scroll';

export function GridView({
  data: daos,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: VirtualContainerProps<Daos>) {

  const {rowVirtualizer, items} = useVirtualInfiniteScroll({
    data: daos,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  })

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
        px: TOKENS.CONTAINER_PX,
      }}
    >
      {daos.map((dao) => (
        <DaoCard key={`dao-${dao.id}`} {...dao} />
      ))}
    </Box>
  );
}
