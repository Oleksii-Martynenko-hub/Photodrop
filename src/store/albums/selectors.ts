import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'
import { AlbumData } from 'api/ProtectedApi'

import { RootState } from 'store'
import { ErrorObject } from 'api/ErrorHandler'

const selectAlbumsReducer = (state: RootState) => state.albumsReducer

export const selectAlbums: Selector<RootState, AlbumData[]> = createSelector(
  selectAlbumsReducer,
  ({ albums }) => albums,
)

export const selectAlbumById: (albumId: number) => Selector<RootState, AlbumData | undefined> = (
  albumId,
) =>
  createSelector(selectAlbumsReducer, ({ albums }) => albums.find((album) => album.id === albumId))

export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectAlbumsReducer,
  ({ status }) => status,
)

export const selectErrors: Selector<RootState, ErrorObject[]> = createSelector(
  selectAlbumsReducer,
  ({ errors }) => errors,
)
