/* eslint-disable @typescript-eslint/no-empty-interface */
import HttpClientProtected from 'api/HttpClientProtected'

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

export type AlbumData = {
  id: string
  name: string
  location: string
  date: string
  icon: string | null
  thumbnails: ThumbnailData[]
}

export type ThumbnailData = {
  url: string
  originalUrl: string
  originalKey: string
}

export interface CreateAlbumData {
  photographerId: string
  name: string
  location: string
  date: string
}

export interface CreateAlbumResponse extends CreateAlbumData {
  id: string
}

export interface GetAlbumsResponse {
  photographerId: string
  albumsInfo: AlbumData[]
}

export type PhotosArray = [
  { photographerId: string },
  { albumId: string },
  { photoName: string },
  { 'Content-Type': string },
]
export interface PresignedPhotosPostBody {
  photosArray: PhotosArray[]
  people: string[]
}

export interface PresignedPhotosPostResponse {
  url: string
  fields: {
    key: string
    originalPhotoKey: string
    'Content-Type': string
    'x-amz-meta-people': string
    bucket: string
    'X-Amz-Algorithm': string
    'X-Amz-Credential': string
    'X-Amz-Date': string
    Policy: string
    'X-Amz-Signature': string
  }
}

export interface GetPhotosResponse {
  count: number
  rows: PhotosData[]
}

export interface GetPhotosBody {
  photographerId: string
  albumId: string
  // page?: number
  // limit?: number
}

export interface People {
  id: string
  name: string | null
  phone: string
  email: string | null
  textMessagesNotification: boolean
  emailNotification: boolean
  unsubscribe: boolean
}

export interface PhotosData extends Omit<AlbumData, 'date' | 'location' | 'icon'> {
  photoUrl: string
  albumId: string
}

class ProtectedApi extends HttpClientProtected {
  private static classInstance?: ProtectedApi

  public constructor() {
    super(API_URL)
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new ProtectedApi()
    }

    return this.classInstance
  }

  public getMe = () => {
    return this.instance.get<[]>('/get-me')
  }

  public postCreateAlbum = (newAlbum: CreateAlbumData) =>
    this.instance.post<CreateAlbumResponse>('/create-album', newAlbum)

  public getAlbums = (photographerId: string) => {
    return this.instance.get<GetAlbumsResponse>('/get-albums-from-db', {
      params: { photographerId },
    })
  }

  // public getAlbumIcons = (albumIds: string[]) => {
  //   return this.instance.post<{ [k: string]: string | null }>('/get-albums-thumbnail-icons', {
  //     albumIds,
  //   })
  // }

  public getPhotos = (params: GetPhotosBody) => {
    return this.instance.get<{ [key: string]: string }>('/get-photos-from-db', { params })
  }

  public postPresignedPostPhotos = (photosToUpload: PresignedPhotosPostBody) =>
    this.instance.post<PresignedPhotosPostResponse[]>('/s3-upload', photosToUpload)

  public postPresignedGetPhotos = (photoKeys: { photoKey: string }[]) =>
    this.instance.post<string[]>('/get-signed-photos', photoKeys)

  public getAllPeople = () => this.instance.get<{ people: People[] }>('/get-all-people')
}

export default ProtectedApi
