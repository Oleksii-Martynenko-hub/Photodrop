import { createAsyncThunk } from '@reduxjs/toolkit'

import { AlbumData, CreateAlbumData } from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { setUserData } from 'store/user/reducers'

export const getAlbumsAsync = createAsyncThunk<AlbumData[], void, ThunkExtra>(
  'albums/getAlbumsAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, getState, dispatch }) => {
    try {
      await dispatch(setUserData())
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.getAlbums(id)

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const postCreateAlbumAsync = createAsyncThunk<
  AlbumData,
  Omit<CreateAlbumData, 'photographerId'>,
  ThunkExtra
>(
  'albums/postCreateAlbumAsync',
  async (albumData, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.postCreateAlbum({
        photographerId: id,
        ...albumData,
      })

      return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
