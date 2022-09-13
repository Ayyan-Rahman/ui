import React from 'react';

import { useQuery, QueryClient } from '@tanstack/react-query';
import jwt from 'jsonwebtoken';
import { useCookie } from 'react-use';

import { Box, Button, Container, Stack, Typography } from '@mui/material';

import { useMe } from '../providers/auth/hooks';

type AuthToken = {
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': ['user', 'admin'];
    'x-hasura-default-role': string;
    'x-hasura-user-id': string;
  };
  type: string;
  iat: number;
  exp: number;
};

type RefreshToken = {
  'x-hasura-user-id': string;
  type: 'refresh_token';
  iat: number;
  exp: number;
};

export default function TestJWT() {
  const { tokens, onUpdateToken } = useMe();

  const [tokenCookie, updateTokenCookie, deleteTokenCookie] =
    useCookie('token');
  const [refreshCookie, updateRefreshCookie, deleteRefreshCookie] =
    useCookie('refresh');

  const [decode, setDecode] = React.useState<AuthToken | null>(null);
  const [decodeRefresh, setDecodeRefresh] = React.useState<RefreshToken | null>(
    null
  );

  React.useEffect(() => {
    if (tokens?.token && tokens?.refresh_token) {
      const base64Url = tokens.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      setDecode(JSON.parse(window.atob(base64)));

      const base64UrlRefresh = tokens.refresh_token.split('.')[1];
      const base64Refresh = base64UrlRefresh
        .replace('-', '+')
        .replace('_', '/');
      setDecodeRefresh(JSON.parse(window.atob(base64Refresh)));
    }
  }, [tokens]);

  const changeJWT = async () => {
    const token = jwt.sign(
      {
        ...decode,
        exp: decode.exp - 10000000,
      },
      process.env.NEXT_PUBLIC_JWT_AUTH_SECRET,
      {
        algorithm: 'HS256',
      }
    );

    const refresh = jwt.sign(
      {
        ...decodeRefresh,
        exp: decodeRefresh.exp - 100000000,
      },
      process.env.NEXT_PUBLIC_JWT_AUTH_SECRET,
      {
        algorithm: 'HS256',
      }
    );

    await onUpdateToken({
      ...tokens,
      token,
      refresh_token: refresh,
    });
  };

  return (
    <Container>
      <h1>Test JWT</h1>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        flex={1}
      >
        <Stack direction="column">
          <h3>Auth Token</h3>
          <Typography
            sx={{
              wordBreak: 'break-all',
              marginBottom: 2,
            }}
          >
            {tokens?.token}
          </Typography>
          <Typography marginBottom={2}>
            Expiry Date: {new Date(decode?.exp * 1000).toString()}
          </Typography>
          <Typography marginBottom={2}>
            Synced TOKEN cookie:{' '}
            {tokenCookie === tokens?.token ? 'true' : 'false'}
          </Typography>
          <h3>Refresh Token</h3>
          <Typography
            marginBottom={2}
            sx={{
              wordBreak: 'break-all',
              marginBottom: 2,
            }}
          >
            {tokens?.refresh_token}
          </Typography>
          <Typography marginBottom={2}>
            Expiry Date: {new Date(decodeRefresh?.exp * 1000).toString()}
          </Typography>
          <Typography marginBottom={2}>
            Synced REFRESH cookie:{' '}
            {refreshCookie === tokens?.refresh_token ? 'true' : 'false'}
          </Typography>
          <Button
            variant="contained"
            sx={{
              marginTop: 2,
            }}
            onClick={changeJWT}
          >
            Go Back in Time
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
