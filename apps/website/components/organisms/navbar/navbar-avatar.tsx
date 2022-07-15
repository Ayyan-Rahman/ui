import setLanguage from 'next-translate/setLanguage';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

import { NestedMenuItem } from 'mui-nested-menu';
import { useDisconnect, useAccount } from 'wagmi';

import { useMenu } from '@gateway/ui';

import { ArrowDropDown } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../../providers/auth';
import { SessionUser } from '../../../types/user';

interface Props {
  user?: SessionUser;
}

/* TODO: Refactor */
export function NavBarAvatar({ user }: Props) {
  const { element, isOpen, onClose, onOpen } = useMenu();

  const withOnClose = useCallback(
    (cb: () => void) => () => {
      cb();
      onClose();
    },
    [onClose]
  );

  const router = useRouter();
  const { onSignOut } = useAuth();

  return (
    <>
      <Tooltip title="Open menu">
        <IconButton onClick={onOpen}>
          <Badge
            overlap="circular"
            badgeContent={
              <ArrowDropDown
                sx={{
                  transform: isOpen ? 'rotate(180deg)' : undefined,
                  transition: '.2s ease-in-out',
                  transitionProperty: 'transform',
                }}
              />
            }
            sx={{
              [`.${badgeClasses.badge}`]: {
                borderRadius: '100%',
                backgroundColor: (theme) => theme.palette.common.white,
                color: (theme) => theme.palette.secondary.contrastText,
                width: (theme) => theme.spacing(2.5),
                height: (theme) => theme.spacing(2.5),
                top: 'unset',
                bottom: (theme) => `calc(50% - ${theme.spacing(2.5)})`,
                right: '-10%',
                boxShadow: (theme) => theme.shadows[1],
              },
            }}
          >
            <Avatar src={user?.pfp}>{user.name[0]}</Avatar>
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: (theme) => theme.spacing(7) }}
        id="menu-appbar"
        anchorEl={element}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isOpen}
        onClose={onClose}
      >
        {/* <NestedMenuItem label="Languages" parentMenuOpen={isOpen}>
          <MenuItem onClick={onChangeLanguage('en')}>English</MenuItem>
          <MenuItem onClick={onChangeLanguage('pt-BR')}>
            Portuguese (Brazil)
          </MenuItem>
        </NestedMenuItem> */}
        <MenuItem
          key="disconnect"
          onClick={withOnClose(() => {
            router.push(ROUTES.LANDING).then(() => onSignOut());
          })}
        >
          <Typography textAlign="center">Disconnect</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
