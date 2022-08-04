/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'react';

import { GqlMethods, gqlAnonMethods } from '../../services/api';
import { SessionUser } from '../../types/user';
import { AuthStatus } from './state';

type Context = {
  me?: SessionUser;
  status: AuthStatus;
  gqlAuthMethods: GqlMethods;
  fetchAuth: <T = unknown>(
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<T>;
  onSignOut: () => void;
  onOpenLogin: () => void;
  onUpdateMe: (cb: (oldMe: SessionUser) => SessionUser) => SessionUser | void;
};

export const AuthContext = createContext<Context>({
  status: 'UNAUTHENTICATED',
  gqlAuthMethods: gqlAnonMethods,
  fetchAuth: (_input) => Promise.reject(new Error('Not authenticated')),
  onSignOut: () => {},
  onOpenLogin: () => {},
  onUpdateMe: () => {},
});

export const useAuth = () => useContext(AuthContext);
