import dynamic from 'next/dynamic';
import Link from 'next/link';

import { PartialDeep } from 'type-fest';

import { Box, Stack, Typography } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useAuth } from '../../../../../providers/auth';
import { Users } from '../../../../../services/graphql/types.generated';
import { AdminBadge } from '../../../../atoms/admin-badge';
import { AvatarFile } from '../../../../atoms/avatar-file';
import { useDaoProfile } from '../../context';
import { AdminMenu } from './admin-menu';

const FollowButtonUser = dynamic<any>(
  () =>
    import('../../../../atoms/follow-button-user').then(
      (mod) => mod.FollowButtonUser
    ),
  {
    ssr: false,
  }
);

type Props = {
  user: PartialDeep<Users>;
};
export function UserCell({ user }: Props) {
  const { me } = useAuth();
  const { isAdmin } = useDaoProfile();

  const isUserAdminOfDao =
    user.permissions?.some(({ permission }) => permission === 'dao_admin') ??
    false;

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>
        <Link href={'/profile/' + user.username} passHref>
          <Stack
            alignItems="center"
            direction="row"
            gap={1}
            component="a"
            sx={{
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            <AdminBadge isAdmin={isUserAdminOfDao}>
              <AvatarFile file={user.picture} fallback="/avatar.png">
                {user.name?.[0]}
              </AvatarFile>
            </AdminBadge>
            <Box>
              <Typography>{user.name}</Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                }}
              >
                @{user.username}
              </Typography>
            </Box>
          </Stack>
        </Link>
      </TableCell>

      {me?.id !== user.id ? (
        <>
          <TableCell align="right">
            <FollowButtonUser
              wallet={user.wallet}
              variant="outlined"
              size="small"
              color="secondary"
            />
          </TableCell>
          <TableCell align="right">
            {isAdmin && <AdminMenu user={user} />}
          </TableCell>
        </>
      ) : (
        <>
          <TableCell /> <TableCell />
        </>
      )}
    </TableRow>
  );
}
