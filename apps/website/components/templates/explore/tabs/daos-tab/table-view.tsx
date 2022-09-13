import Link from 'next/link';

import { TOKENS } from '@gateway/theme';

import { Box, Chip, Stack, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { categoriesMap } from '../../../../../constants/dao';
import { ROUTES } from '../../../../../constants/routes';
import {
  useVirtualInfiniteScroll,
  VirtualContainerProps,
} from '../../../../../hooks/use-virtual-infinite-scroll';
import { useAuth } from '../../../../../providers/auth';
import { Daos } from '../../../../../services/graphql/types.generated';
import { AvatarFile } from '../../../../atoms/avatar-file';
import { CenteredLoader } from '../../../../atoms/centered-loader';
import { FollowButtonDAO } from '../../../../atoms/follow-button-dao';

export function TableView({
  data: daos,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: VirtualContainerProps<Daos>) {
  const { me } = useAuth();

  const { items, rowVirtualizer } = useVirtualInfiniteScroll({
    data: daos,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  });

  return (
    <TableContainer
      sx={{
        '& .MuiTableCell-root:first-of-type': {
          pl: TOKENS.CONTAINER_PX,
        },
        '& .MuiTableCell-root:last-of-type': {
          pr: TOKENS.CONTAINER_PX,
        },
      }}
    >
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Dao</TableCell>
            <TableCell align="left">Category</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((row) => {
            const { size, start, index } = row;
            const isLoaderRow = index > daos.length - 1;
            const dao = daos[index];
            if (!hasNextPage && isLoaderRow) return null;
            if (isLoaderRow) {
              return (
                <CenteredLoader
                  key={row.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${size}px`,
                    transform: `translateY(${start}px)`,
                  }}
                />
              );
            }
            const isAdmin = dao.permissions.some(
              ({ user_id, permission }) =>
                user_id === me?.id && permission === 'dao_admin'
            );

            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={dao.id}>
                <Link
                  passHref
                  href={ROUTES.DAO_PROFILE.replace('[slug]', dao.slug)}
                >
                  <TableCell sx={{ cursor: 'pointer' }}>
                    <Stack alignItems="center" direction="row" gap={1}>
                      <AvatarFile file={dao.logo} fallback={dao.logo_url}>
                        {dao.name?.[0]}
                      </AvatarFile>
                      <Box>
                        <Typography>{dao.name}</Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={(theme) => ({
                            display: 'block',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: '70ch',
                            [`${theme.breakpoints.down('md')}`]: {
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            },
                          })}
                        >
                          {dao.description.length > 140
                            ? `${dao.description.slice(0, 139)}...`
                            : dao.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                </Link>
                <TableCell>
                  <Stack direction="row" gap={1}>
                    {dao.categories?.map((category) => {
                      const label = categoriesMap.get(category) ?? category;
                      return (
                        <Chip
                          key={`dao-${dao.id}-category-${category}`}
                          label={label}
                        />
                      );
                    })}
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  {!isAdmin && (
                    <FollowButtonDAO
                      daoId={dao.id}
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
