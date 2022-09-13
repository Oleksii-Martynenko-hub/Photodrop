import { createSelector, Selector } from 'reselect'

import { RootState } from 'store'

const selectUserReducer = (state: RootState) => state.userReducer

export const selectUserId: Selector<RootState, number | undefined> = createSelector(
  selectUserReducer,
  ({ id }) => id,
)
export const selectLogin: Selector<RootState, string | undefined> = createSelector(
  selectUserReducer,
  ({ login }) => login,
)
