import { createSlice } from '@reduxjs/toolkit'

import { APIError } from 'api/ErrorHandler'
import { APIStatus } from 'api/MainApi'
import { AlbumData } from 'api/ProtectedApi'
import { toast } from 'react-toastify'
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

const getAlbumsToastId = 'getAlbumsToastId'

export const albumsSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    clearAlbumsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAlbumsAsync.pending,
      pendingCase(() =>
        toast.loading('Loading albums...', {
          toastId: getAlbumsToastId,
          position: 'top-center',
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }),
      ),
    )
    builder.addCase(
      getAlbumsAsync.rejected,
      rejectedCase((_, action) => {
        toast.update(getAlbumsToastId, {
          render: action.payload?.message,
          type: 'error',
          isLoading: false,
          autoClose: 1500,
        })
      }),
    )
    builder.addCase(getAlbumsAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums = action.payload
      toast.update(getAlbumsToastId, {
        render: 'Albums successfully loaded',
        type: 'success',
        isLoading: false,
        autoClose: 1500,
      })
    })

    builder.addCase(postCreateAlbumAsync.pending, pendingCase())
    builder.addCase(postCreateAlbumAsync.rejected, rejectedCase())
    builder.addCase(postCreateAlbumAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums.push(action.payload)
    })
  },
})

export const { clearAlbumsState } = albumsSlice.actions

export default albumsSlice.reducer
