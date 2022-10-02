import { createAsyncThunk } from '@reduxjs/toolkit'

import { GetPhotosBody, People, PhotosArray } from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { Photos } from './reducers'
import { DropZoneFiles } from 'components/UploadDropZone'

export const getPhotosAsync = createAsyncThunk<Photos, { albumId: number }, ThunkExtra>(
  'photos/getPhotosAsync',
  async ({ albumId }, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const { id } = getState().userReducer
      const { limit } = getState().photosReducer

      if (!id) throw new Error('Error getPhotosAsync: photographerId is missing')

      const response = await protectedApi.getPhotos({
        photographerId: id,
        albumId,
        limit,
      })

      const photoKeys = response.rows.map((photo) => ({ photoKey: photo.name }))

      const photoLinks = await protectedApi.postPresignedGetPhotos(photoKeys)

      const formattedPhotos = response.rows.map(({ name, ...photo }) => {
        const photoLink = photoLinks.find((link) => link.includes(name)) || ''

        return {
          name,
          photoLink,
          ...photo,
        }
      })

      return {
        albumId,
        count: response.count,
        hasMore: response.count > formattedPhotos.length,
        page: 1,
        photosList: formattedPhotos,
      }
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const getMorePhotosAsync = createAsyncThunk<
  Photos,
  Omit<GetPhotosBody, 'photographerId'>,
  ThunkExtra
>(
  'photos/getMorePhotosAsync',
  async ({ albumId, page = 1 }, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const { id } = getState().userReducer
      const { limit } = getState().photosReducer

      if (!id) throw new Error('Error getPhotosAsync: photographerId is missing')

      const response = await protectedApi.getPhotos({
        photographerId: id,
        albumId,
        limit,
        page: page + 1,
      })

      const photoKeys = response.rows.map((photo) => ({ photoKey: photo.name }))

      const photoLinks = await protectedApi.postPresignedGetPhotos(photoKeys)

      const formattedPhotos = response.rows.map(({ name, ...photo }) => {
        const photoLink = photoLinks.find((link) => link.includes(name)) || ''

        return {
          name,
          photoLink,
          ...photo,
        }
      })

      return {
        albumId,
        count: response.count,
        hasMore: response.count > page * limit + formattedPhotos.length,
        page: page + 1,
        photosList: formattedPhotos,
      }
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const getPeopleAsync = createAsyncThunk<People[], void, ThunkExtra>(
  'photos/getPeopleAsync',
  async (_, { rejectWithValue, extra: { protectedApi } }) => {
    try {
      const response = await protectedApi.getAllPeople()

      return response.people
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const postUploadPhotosAsync = createAsyncThunk<
  void,
  {
    files: DropZoneFiles[]
    people: string[]
    albumId: number
  },
  ThunkExtra
>(
  'photos/postUploadPhotosAsync',
  async (
    { files, people, albumId },
    { rejectWithValue, extra: { protectedApi, storageApi }, getState, dispatch },
  ) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const photosArray: PhotosArray[] = files.map((file) => {
        return [
          { photographerId: id },
          { albumId },
          { photoName: file.name },
          { 'Content-Type': 'image/jpg' },
        ]
      })

      const photos = await protectedApi.postPresignedPostPhotos({ photosArray, people })

      const postToBucketPromises = photos.map(({ fields }) => {
        const formData = new FormData()

        const fileIndex = files.findIndex((file) => fields.key.includes(file.name))

        const { file, name, setUploadProgress } = files[fileIndex]

        formData.append('key', fields.key)
        formData.append('Content-Type', fields['Content-Type'])
        formData.append('x-amz-meta-people', fields['x-amz-meta-people'])
        formData.append('bucket', fields.bucket)
        formData.append('X-Amz-Algorithm', fields['X-Amz-Algorithm'])
        formData.append('X-Amz-Credential', fields['X-Amz-Credential'])
        formData.append('X-Amz-Date', fields['X-Amz-Date'])
        formData.append('Policy', fields.Policy)
        formData.append('X-Amz-Signature', fields['X-Amz-Signature'])
        formData.append('file', file as Blob)

        const onUploadProgress = (e: ProgressEvent) => {
          setUploadProgress(Math.round((100 * e.loaded) / e.total), name)
        }
        return storageApi.postPhoto({ formData, onUploadProgress })
      })

      await Promise.all(postToBucketPromises)

      setTimeout(async () => {
        await dispatch(getPhotosAsync({ albumId }))
      }, 3000)
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
