import HttpClient from './HttpClient'

export const API_URL = process.env.REACT_APP_STORAGE_API_URL || 'http://localhost:8080/api'

interface PostPhotoBody {
  formData: FormData
  onUploadProgress: (e: ProgressEvent) => void
}

class StorageApi extends HttpClient {
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

  public postPhoto = ({ formData, onUploadProgress }: PostPhotoBody) =>
    this.instance.post<string>('/', formData, {
      onUploadProgress,
    })
}

export default StorageApi
