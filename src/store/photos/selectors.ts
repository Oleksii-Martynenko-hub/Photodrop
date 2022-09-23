import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'
import { AlbumData, PhotosData } from 'api/ProtectedApi'

import { RootState } from 'store'
import { PhotosList } from './reducers'
import { ErrorObject } from 'api/ErrorHandler'

const selectAlbumsReducer = (state: RootState) => state.photosReducer

export const selectPhotosByAlbumId: (
  albumId: number,
) => Selector<RootState, PhotosList[] | undefined> = (albumId) => {
  return createSelector(
    selectAlbumsReducer,
    ({ photos }) => photos.find((photoList) => photoList.albumId === albumId)?.photosList,
  )
}

export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectAlbumsReducer,
  ({ status }) => status,
)

export const selectErrors: Selector<RootState, ErrorObject[]> = createSelector(
  selectAlbumsReducer,
  ({ errors }) => errors,
)
