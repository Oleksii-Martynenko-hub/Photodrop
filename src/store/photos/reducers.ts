import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { PhotosData } from 'api/ProtectedApi'

import { pendingCase, rejectedCase } from 'store'
import { getPhotosAsync, postUploadPhotosAsync } from './actions'

export interface PhotosList extends PhotosData {
  photoLink: string
}

export interface Photos {
  albumId: number
  count: number
  photosList: PhotosList[]
}

export interface PhotosState {
  photos: Photos[]
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: PhotosState = {
  photos: [],
  status: APIStatus.IDLE,
  errors: [],
}

export const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    clearPhotosState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getPhotosAsync.pending, pendingCase())
    builder.addCase(
      getPhotosAsync.rejected,
      rejectedCase((_, action) => {
        toast.error(action.payload?.[0].msg, {
          position: 'top-center',
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          autoClose: 1500,
          progress: undefined,
        })
      }),
    )
    builder.addCase(getPhotosAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      if (state.photos.find((p) => p.albumId === action.payload.albumId)) {
        state.photos = state.photos.map((p) =>
          p.albumId === action.payload.albumId
            ? {
                ...p,
                photosList: action.payload.photosList.reverse(),
              }
            : p,
        )
        return
      }
      state.photos.push({
        ...action.payload,
        photosList: action.payload.photosList.reverse(),
      })
    })

    builder.addCase(postUploadPhotosAsync.pending, pendingCase())
    builder.addCase(
      postUploadPhotosAsync.rejected,
      rejectedCase((_, action) => {
        toast.error(action.payload?.[0].msg, {
          position: 'top-center',
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          autoClose: 1500,
          progress: undefined,
        })
      }),
    )
    builder.addCase(postUploadPhotosAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
    })
  },
})

export const { clearPhotosState } = photosSlice.actions

export default photosSlice.reducer
