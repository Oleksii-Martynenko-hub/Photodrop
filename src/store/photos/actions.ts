import { createAsyncThunk } from '@reduxjs/toolkit'

import {
  AlbumData,
  CreateAlbumData,
  GetPhotosResponse,
  PhotosArray,
  PhotosData,
} from 'api/ProtectedApi'
import { getExceptionPayload } from 'api/ErrorHandler'

import { ThunkExtra } from 'store'
import { setUserData } from 'store/user/reducers'
import { Photos } from './reducers'

export const getPhotosAsync = createAsyncThunk<Photos, number, ThunkExtra>(
  'albums/getPhotosAsync',
  async (albumId, { rejectWithValue, extra: { protectedApi }, getState }) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getPhotosAsync: photographerId is missing')

      const response = await protectedApi.getPhotos({ photographerId: id, albumId })

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

      return { albumId, count: response.count, photosList: formattedPhotos }
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)

export const postUploadPhotosAsync = createAsyncThunk<
  void,
  {
    fileList: FileList
    people: string[]
    albumId: number
  },
  ThunkExtra
>(
  'albums/postUploadPhotosAsync',
  async (
    { fileList, people, albumId },
    { rejectWithValue, extra: { protectedApi, storageApi }, getState },
  ) => {
    try {
      const { id } = getState().userReducer

      if (!id) throw new Error('Error getAlbumsAsync: photographerId is missing')

      const photosArray: PhotosArray[] = Array.from(fileList).map((file) => {
        return [
          { photographerId: id },
          { albumId },
          { photoName: file.name },
          { 'Content-Type': 'image/jpg' },
        ]
      })

      const photos = await protectedApi.postPresignedPostPhotos({ photosArray, people })

      photos.forEach(async ({ fields }, i) => {
        const formData = new FormData()

        const fileIndex = Array.from(fileList).findIndex((file) => file.name === fields.key)

        const file = fileList.item(fileIndex)

        formData.append('file', file as Blob)
        formData.append('key', fields.key)
        formData.append('bucket', fields.bucket)
        formData.append('Policy', fields.Policy)
        formData.append('Content-Type', fields['Content-Type'])
        formData.append('X-Amz-Date', fields['X-Amz-Date'])
        formData.append('X-Amz-Algorithm', fields['X-Amz-Algorithm'])
        formData.append('X-Amz-Credential', fields['X-Amz-Credential'])
        formData.append('X-Amz-Signature', fields['X-Amz-Signature'])
        formData.append('x-amz-meta-people', fields['x-amz-meta-people'])

        const onUploadProgress = (e: ProgressEvent) => {
          console.log(`onUploadProgress ${i} file: ${Math.round((100 * e.loaded) / e.total)}%`)
        }

        const bucket = await storageApi.postPhoto({ formData, onUploadProgress })
        console.log('🚀 ~ photos.forEach ~ bucket ' + i + ' file', bucket)
      })

      // return response
    } catch (error) {
      return rejectWithValue(getExceptionPayload(error))
    }
  },
)
