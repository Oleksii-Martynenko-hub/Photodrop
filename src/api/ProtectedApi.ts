/* eslint-disable no-prototype-builtins */
import HttpClientProtected from 'api/HttpClientProtected'
import { AlbumData } from 'store/albums/reducers'

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

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

  public postCreateAlbum = (user: any) => this.instance.post<any>('/create-album', user)

  public getAlbums = (photographerId: number) => {
    return this.instance.get<AlbumData[]>('/get-albums-from-db', { params: { photographerId } })
  }

  public postPresignedPhotos = (user: any) => this.instance.post<any>('/s3-upload', user)
}

export default ProtectedApi
