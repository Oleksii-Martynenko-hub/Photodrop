import { createAsyncThunk } from '@reduxjs/toolkit'

import { AlbumData } from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { setUserData } from 'store/user/reducers'

export const getAlbumsAsync = createAsyncThunk<AlbumData[], void, ThunkExtra>(
  'albums/getAlbumsAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, getState, dispatch }) => {
    try {
      await dispatch(setUserData())
      const { id } = getState().userReducer
      console.log('🚀 getAlbumsAsync~ id', id)

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.getAlbums(id)

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
