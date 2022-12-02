import { createAsyncThunk } from '@reduxjs/toolkit'

import { AlbumData, CreateAlbumData } from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { setUserData } from 'store/user/reducers'
import { logoutIfTokenInvalid } from 'store/login/actions'

export const getAlbumsAsync = createAsyncThunk<AlbumData[], void, ThunkExtra>(
  'albums/getAlbumsAsync',
  async (_, { rejectWithValue, extra: { protectedApi }, getState, dispatch }) => {
    try {
      await dispatch(setUserData())
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.getAlbums(id)

      // eslint-disable-next-line no-prototype-builtins
      if (response.hasOwnProperty('errors')) throw { response }

      // const albumIds = response.map(({ id }) => id)

      // const icons = await protectedApi.getAlbumIcons(albumIds)

      // const albumsWithIcons = albumIds
      //   .map((id) => {
      //     const album = response.find((album) => id === album.id)

      //     if (album) {
      //       const icon = icons[album.id.toString()]

      //       return { ...album, icon }
      //     }
      //   })
      //   .filter((album) => album && album.icon !== 'Album does not exist')

      return response.albumsInfo
    } catch (error) {
      dispatch(logoutIfTokenInvalid(error))
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const getPhotosByAlbumIdAsync = createAsyncThunk<AlbumData, AlbumData, ThunkExtra>(
  'albums/getOriginalPhotosAsync',
  async (album, { rejectWithValue, extra: { protectedApi }, getState, dispatch }) => {
    try {
      await dispatch(setUserData())
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.getPhotos({ photographerId: id, albumId: album.id })

      // eslint-disable-next-line no-prototype-builtins
      if (response.hasOwnProperty('errors')) throw { response }

      const updatedThumbnails = album.thumbnails.map(({ url, originalKey }) => ({
        url,
        originalKey,
        originalUrl: response[originalKey],
      }))

      return { ...album, thumbnails: updatedThumbnails }
    } catch (error) {
      dispatch(logoutIfTokenInvalid(error))
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
  async (albumData, { rejectWithValue, extra: { protectedApi }, getState, dispatch }) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const response = await protectedApi.postCreateAlbum({
        photographerId: id,
        ...albumData,
      })

      const { photographerId, ...album } = response

      const formattedAlbum = {
        ...album,
        icon: null,
        thumbnails: [],
      }

      return formattedAlbum
    } catch (error) {
      dispatch(logoutIfTokenInvalid(error))
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
