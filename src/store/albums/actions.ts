import { createAsyncThunk } from '@reduxjs/toolkit'

import { AlbumData } from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'

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
