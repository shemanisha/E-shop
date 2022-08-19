import { createAction, props } from '@ngrx/store';
import { User } from '../modals/User.model';

export const buildUserSession = createAction('[Users] Build User Session');

export const buildUserSessionSuccess = createAction(
  '[Users] Load Users Session Success',
  props<{ user: any }>()
);

export const buildUserSessionFailure = createAction(
  '[Users] Load Users Failure'
);
