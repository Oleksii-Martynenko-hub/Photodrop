import { createSlice } from '@reduxjs/toolkit'

import { APIError, APIStatus } from 'api/MainApi'

import { getAlbumsAsync } from 'store/albums/actions'

export interface AlbumData {
  id: number
  name: string
  location: string
  date: string
  photographerId: number
}

interface AlbumsState {
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAlbumsAsync.pending, (state) => {
      state.status = APIStatus.PENDING
    })
    builder.addCase(getAlbumsAsync.fulfilled, (state, action) => {
      state.status = APIStatus.FULFILLED
      state.albums = action.payload
    })
    builder.addCase(getAlbumsAsync.rejected, (state, action) => {
      state.error = { message: action.error.message || '', code: +(action.error.code || '0') }
      state.status = APIStatus.REJECTED
    })
  },
})

// export const {  } = albumsSlice.actions

export default albumsSlice.reducer
