import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as UsersActions from './users.actions';
import { UsersEntity } from './users.models';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
  user: any;
  isAuthenticated: boolean;
  abc: string;
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUsersState: UsersState = {
  user: null,
  isAuthenticated: false,
  abc: 'abc',
};

const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.buildUserSession, (state) => ({
    ...state,
    isAuthenticated: true,
  })),
  on(UsersActions.buildUserSessionSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isAuthenticated: true,
    abc: 'hello',
  })),
  on(UsersActions.buildUserSessionFailure, (state, action) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    abc: 'zero',
  }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  console.log('reducer', state, action);
  return usersReducer(state, action);
}
