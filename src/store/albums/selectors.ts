import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'
import { AlbumData } from 'api/ProtectedApi'

import { RootState } from 'store'

const selectAlbumsReducer = (state: RootState) => state.albumsReducer

export const selectAlbums: Selector<RootState, AlbumData[]> = createSelector(
  selectAlbumsReducer,
  ({ albums }) => albums,
)
export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectAlbumsReducer,
  ({ status }) => status,
)
export const selectErrorMessage: Selector<RootState, string> = createSelector(
  selectAlbumsReducer,
  ({ error }) => error.message,
)
export const selectStatusCode: Selector<RootState, number> = createSelector(
  selectAlbumsReducer,
  ({ error }) => error.code,
)
