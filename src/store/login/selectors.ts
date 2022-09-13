import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'

import { RootState } from 'store'

const selectLoginReducer = (state: RootState) => state.loginReducer

export const selectIsLoggedIn: Selector<RootState, boolean> = createSelector(
  selectLoginReducer,
  ({ isLoggedIn }) => isLoggedIn,
)
export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectLoginReducer,
  ({ status }) => status,
)
