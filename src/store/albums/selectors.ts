import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'

import { RootState } from 'store'
import { AlbumData } from 'store/albums/reducers'

const selectAlbumsReducer = (state: RootState) => state.albumsReducer

export const selectAlbums: Selector<RootState, AlbumData[]> = createSelector(
  selectAlbumsReducer,
  ({ albums }) => albums,
)
export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectAlbumsReducer,
  ({ status }) => status,
)
