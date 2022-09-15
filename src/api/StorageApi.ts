import HttpClientProtected from 'api/HttpClientProtected'
import { PresignedPhotosPostResponse } from './ProtectedApi'

export const API_URL = process.env.STORAGE_API_URL || 'http://localhost:8080/api'

class StorageApi extends HttpClientProtected {
  private static classInstance?: StorageApi

  public constructor() {
    super(API_URL)
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new StorageApi()
    }

    return this.classInstance
  }

  public postPhoto = (uploadPhotoBody: PresignedPhotosPostResponse) =>
    this.instance.post<string>('/', uploadPhotoBody)
}

export default StorageApi
