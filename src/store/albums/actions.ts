import { createAsyncThunk } from '@reduxjs/toolkit'

import { getExceptionPayload } from 'api/MainApi'

import { ThunkExtra } from 'store'
import { AlbumData } from 'store/albums/reducers'

export const getAlbumsAsync = createAsyncThunk<AlbumData[], undefined, ThunkExtra>(
  'albums/getAlbumsAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const state = getState()
      console.log('🚀 ~ state', state) // change type of getState in createAsyncThunk (getAlbumsAsync)

      const response = await protectedApi.getAlbums(1)

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
