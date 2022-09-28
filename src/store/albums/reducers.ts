import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { ErrorObject } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { AlbumData } from 'api/ProtectedApi'

import { pendingCase, rejectedCase } from 'store'
import { getAlbumsAsync, postCreateAlbumAsync } from 'store/albums/actions'
import { errorToast } from 'store/login/reducers'

export interface AlbumsState {
  albums: AlbumData[]
  status: APIStatus
  errors: ErrorObject[]
}

const initialState: AlbumsState = {
  albums: [],
  status: APIStatus.IDLE,
  errors: [],
}

export const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    clearAlbumsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getAlbumsAsync.pending, pendingCase())
    builder.addCase(
      getAlbumsAsync.rejected,
      rejectedCase((_, action) => {
        if (action.payload) {
          action.payload.forEach((error) => {
            toast.error(...errorToast(error.msg))
          })
        }
      }),
    )
    builder.addCase(getAlbumsAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums = action.payload.reverse()
    })

    builder.addCase(postCreateAlbumAsync.pending, pendingCase())
    builder.addCase(
      postCreateAlbumAsync.rejected,
      rejectedCase((_, action) => {
        if (action.payload) {
          action.payload.forEach((error) => {
            toast.error(...errorToast(error.msg))
          })
        }
      }),
    )
    builder.addCase(postCreateAlbumAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums.unshift(action.payload)

      toast.success(`Album "${action.payload.name}" successfully created`, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    })
  },
})

export const { clearAlbumsState } = albumsSlice.actions

export default albumsSlice.reducer
