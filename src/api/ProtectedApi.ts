/* eslint-disable @typescript-eslint/no-empty-interface */
import HttpClientProtected from 'api/HttpClientProtected'

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

export type AlbumData = {
  id: number
  name: string
  location: string
  date: string
  photographerId: number
}

export interface CreateAlbumData extends Omit<AlbumData, 'id'> {}

export type PhotosArray = [
  { photographerId: number },
  { albumId: number },
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

export interface PhotosData extends Omit<AlbumData, 'date' | 'location'> {
  photoUrl: string
  albumId: number
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

  public postCreateAlbum = (newAlbum: CreateAlbumData) =>
    this.instance.post<AlbumData>('/create-album', newAlbum)

  public getAlbums = (photographerId: number) => {
    return this.instance.get<AlbumData[]>('/get-albums-from-db', { params: { photographerId } })
  }

  public getPhotos = (params: {
    photographerId: number
    albumId: number
    page?: number
    limit?: number
  }) => {
    return this.instance.get<GetPhotosResponse>('/get-photos-from-db', { params })
  }

  public postPresignedPostPhotos = (photosToUpload: PresignedPhotosPostBody) =>
    this.instance.post<PresignedPhotosPostResponse[]>('/s3-upload', photosToUpload)

  public postPresignedGetPhotos = (photoKeys: { photoKey: string }[]) =>
    this.instance.post<string[]>('/get-signed-photos', photoKeys)

  public getAllPeople = () => this.instance.post<string[]>('/get-all-people')
}

export default ProtectedApi
