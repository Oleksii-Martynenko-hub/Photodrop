import { createSelector, Selector } from 'reselect'

import { APIStatus } from 'api/MainApi'

import { RootState } from 'store'
import { PhotosList } from './reducers'
import { ErrorObject } from 'api/ErrorHandler'
import { People } from 'api/ProtectedApi'

const selectPhotosReducer = (state: RootState) => state.photosReducer

export const selectPhotosByAlbumId: (
  albumId: number,
) => Selector<RootState, PhotosList[] | undefined> = (albumId) => {
  return createSelector(
    selectPhotosReducer,
    ({ photos }) => photos.find((photoList) => photoList.albumId === albumId)?.photosList,
  )
}

export const selectPhotoCountByAlbumId: (
  albumId: number,
) => Selector<RootState, number | undefined> = (albumId) => {
  return createSelector(
    selectPhotosReducer,
    ({ photos }) => photos.find((photoList) => photoList.albumId === albumId)?.count,
  )
}

export const selectPeople: Selector<RootState, People[]> = createSelector(
  selectPhotosReducer,
  ({ people }) => people,
)

export const selectStatus: Selector<RootState, APIStatus> = createSelector(
  selectPhotosReducer,
  ({ status }) => status,
)

export const selectErrors: Selector<RootState, ErrorObject[]> = createSelector(
  selectPhotosReducer,
  ({ errors }) => errors,
)
