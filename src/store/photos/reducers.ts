import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { People, PhotosData } from 'api/ProtectedApi'

import { pendingCase, rejectedCase } from 'store'
import { getPeopleAsync, getPhotosAsync, postUploadPhotosAsync } from './actions'
import { errorToast } from 'store/login/reducers'

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
  people: People[]
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: PhotosState = {
  photos: [],
  people: [],
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
        if (action.payload) {
          action.payload.forEach((error) => {
            toast.error(...errorToast(error.msg))
          })
        }
      }),
    )
    builder.addCase(getPhotosAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      if (state.photos.find((p) => p.albumId === action.payload.albumId)) {
        state.photos = state.photos.map((p) => {
          if (p.albumId === action.payload.albumId) {
            const updatedPhotos = action.payload.isNextPage
              ? [...p.photosList, ...action.payload.photosList]
              : action.payload.photosList

            return {
              ...p,
              photosList: updatedPhotos,
            }
          }
          return p
        })
        return
      }
      state.photos.push({
        ...action.payload,
        photosList: action.payload.photosList,
      })
    })

    builder.addCase(getPeopleAsync.pending, pendingCase())
    builder.addCase(
      getPeopleAsync.rejected,
      rejectedCase((_, action) => {
        if (action.payload) {
          action.payload.forEach((error) => {
            toast.error(...errorToast(error.msg))
          })
        }
      }),
    )
    builder.addCase(getPeopleAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.people = action.payload
    })

    builder.addCase(postUploadPhotosAsync.pending, pendingCase())
    builder.addCase(
      postUploadPhotosAsync.rejected,
      rejectedCase((_, action) => {
        if (action.payload) {
          action.payload.forEach((error) => {
            toast.error(...errorToast(error.msg))
          })
        }
      }),
    )
    builder.addCase(postUploadPhotosAsync.fulfilled, (state) => {
      state.status = APIStatus.FULFILLED
    })
  },
})

export const { clearPhotosState } = photosSlice.actions

export default photosSlice.reducer
