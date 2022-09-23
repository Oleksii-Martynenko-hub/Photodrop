import { FC, useEffect } from 'react'
import { useParams } from 'react-router'
import { Container } from '@mui/material'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { selectAlbumById } from 'store/albums/selectors'
import { selectPhotosByAlbumId } from 'store/photos/selectors'
import { getPhotosAsync, postUploadPhotosAsync } from 'store/photos/actions'
import { Image } from 'components/Image'

const CurrentAlbum: FC = () => {
  const { id } = useParams<{ id: string }>()

  const dispatch = useDispatch()

  const album = useSelector(selectAlbumById(+(id || '')))
  const photos = useSelector(selectPhotosByAlbumId(+(id || '')))

  useEffect(() => {
    if (!photos && album) {
      dispatch(getPhotosAsync(album.id))
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length && album) {
      dispatch(
        postUploadPhotosAsync({
          fileList: e.target.files,
          people: ['38095'],
          albumId: album.id,
        }),
      )
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <p>
        <b>Album:</b> {album?.name}
      </p>

      <p>
        <b>location:</b> {album?.location}
      </p>

      <p>
        <b>date:</b> {album?.date}
      </p>
      <hr />
      <input type='file' name='image' id='image' multiple onChange={onChange} />
      <hr />
      <ul>
        {photos &&
          photos.map(({ id, name, photoLink }) => (
            <li key={id}>
              <Image width={300} height={220} src={photoLink} alt={name.split('_')[1]} />
            </li>
          ))}
      </ul>
    </motion.div>
  )
}

export default CurrentAlbum
