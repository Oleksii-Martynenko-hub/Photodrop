import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import { APIError } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { AlbumData } from 'api/ProtectedApi'

import { pendingCase, rejectedCase } from 'store'
import { getAlbumsAsync, postCreateAlbumAsync } from 'store/albums/actions'

export interface AlbumsState {
  albums: AlbumData[]
  status: APIStatus
  error: APIError
}

const initialState: AlbumsState = {
  albums: [],
  status: APIStatus.IDLE,
  error: {
    message: '',
    code: 0,
  },
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
        toast.error(action.payload?.message, {
          position: 'top-center',
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          autoClose: 1500,
          progress: undefined,
        })
      }),
    )
    builder.addCase(getAlbumsAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums = action.payload.reverse()
    })

    builder.addCase(postCreateAlbumAsync.pending, pendingCase())
    builder.addCase(postCreateAlbumAsync.rejected, rejectedCase())
    builder.addCase(postCreateAlbumAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums.unshift(action.payload)
    })
  },
})

export const { clearAlbumsState } = albumsSlice.actions

export default albumsSlice.reducer
