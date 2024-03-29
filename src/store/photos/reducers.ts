import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { People, PhotosData } from 'api/ProtectedApi'

import { pendingCase, rejectedCase } from 'store'
import {
  // getMorePhotosAsync,
  getPeopleAsync,
  // getPhotosAsync,
  postUploadPhotosAsync,
} from 'store/photos/actions'
import { errorToast } from 'store/login/reducers'
import { uniqBy } from 'utils/uniq-by'

export interface PhotosList extends PhotosData {
  photoLink: string
}

export interface Photos {
  albumId: string
  count: number
  hasMore: boolean
  page: number
  photosList: PhotosList[] | null
}

export interface PhotosState {
  photos: Photos[]
  people: People[] | null
  limit: number
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: PhotosState = {
  photos: [],
  people: null,
  limit: 10,
  status: APIStatus.IDLE,
  errors: [],
}

export const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setPageByAlbumId: (
      state: PhotosState,
      { payload }: PayloadAction<{ albumId: string; page: number }>,
    ) => {
      const photos = state.photos.find(({ albumId }) => albumId === payload.albumId)
      if (photos) photos.page = payload.page
    },

    setCountByAlbumId: (
      state: PhotosState,
      { payload }: PayloadAction<{ albumId: string; count: number }>,
    ) => {
      const photos = state.photos.find(({ albumId }) => albumId === payload.albumId)
      if (photos) photos.count = payload.count
    },

    setHasMorePhotosByAlbumId: (
      state: PhotosState,
      { payload }: PayloadAction<{ albumId: string; hasMore: boolean }>,
    ) => {
      const photos = state.photos.find(({ albumId }) => albumId === payload.albumId)
      if (photos) photos.hasMore = payload.hasMore
    },
    addPhotosByAlbumId: (
      state: PhotosState,
      { payload }: PayloadAction<{ albumId: string; newPhotosList: PhotosList[] }>,
    ) => {
      const { albumId, newPhotosList } = payload
      console.log('🚀 ~ newPhotosList', newPhotosList)

      const photosByAlbumId = state.photos.find((p) => p.albumId === albumId)

      if (photosByAlbumId) {
        const { photosList, ...other } = photosByAlbumId

        Object.assign(photosByAlbumId, {
          photosList: [...(photosList || []), ...(newPhotosList || [])],
          ...other,
        })
      }
    },
    clearPhotosState: () => initialState,
  },

  extraReducers: (builder) => {
    // builder.addCase(getPhotosAsync.pending, pendingCase())
    // builder.addCase(
    //   getPhotosAsync.rejected,
    //   rejectedCase((_, { payload }) => errorToast(payload)),
    // )
    // builder.addCase(getPhotosAsync.fulfilled, (state, { payload }) => {
    //   state.status = APIStatus.FULFILLED

    //   const { albumId, photosList, ...other } = payload

    //   const photos = state.photos.find((p) => p.albumId === albumId)

    //   if (photos) {
    //     Object.assign(photos, { photosList, ...other })
    //     return
    //   }

    //   state.photos.push({
    //     albumId,
    //     ...other,
    //     photosList,
    //   })
    // })

    // builder.addCase(getMorePhotosAsync.pending, pendingCase())
    // builder.addCase(
    //   getMorePhotosAsync.rejected,
    //   rejectedCase((_, { payload }) => errorToast(payload)),
    // )
    // builder.addCase(getMorePhotosAsync.fulfilled, (state, { payload }) => {
    //   state.status = APIStatus.FULFILLED

    //   const { albumId, photosList, ...other } = payload

    //   const photos = state.photos.find((p) => p.albumId === albumId)

    //   if (photos) {
    //     const updatedPhotoList = uniqBy<PhotosList>(
    //       [...(photos.photosList || []), ...(photosList || [])],
    //       'id',
    //     )

    //     Object.assign(photos, {
    //       photosList: updatedPhotoList,
    //       ...other,
    //     })
    //   }
    // })

    builder.addCase(getPeopleAsync.pending, pendingCase())
    builder.addCase(
      getPeopleAsync.rejected,
      rejectedCase((_, { payload }) => errorToast(payload)),
    )
    builder.addCase(getPeopleAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.people = action.payload
    })

    builder.addCase(postUploadPhotosAsync.pending, pendingCase())
    builder.addCase(
      postUploadPhotosAsync.rejected,
      rejectedCase((_, { payload }) => errorToast(payload)),
    )
    builder.addCase(postUploadPhotosAsync.fulfilled, (state) => {
      state.status = APIStatus.FULFILLED
    })
  },
})

export const { clearPhotosState, addPhotosByAlbumId } = photosSlice.actions

export default photosSlice.reducer
