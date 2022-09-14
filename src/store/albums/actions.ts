import { createAsyncThunk } from '@reduxjs/toolkit'

import { getExceptionPayload } from 'api/MainApi'

import { ThunkExtra } from 'store'
import { AlbumData } from 'store/albums/reducers'

export const getAlbumsAsync = createAsyncThunk<AlbumData[], void, ThunkExtra>(
  'albums/getAlbumsAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.getAlbums(id)

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
