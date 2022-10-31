import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Dialog,
  Grid,
  ImageList,
  ImageListItem,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import moment from 'moment'
import Uppy, { UppyFile } from '@uppy/core'
import { Dashboard, useUppy } from '@uppy/react'
import AwsS3 from '@uppy/aws-s3'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import { toast } from 'react-toastify'

import { APIStatus } from 'api/MainApi'
import ProtectedApi, { PhotosArray } from 'api/ProtectedApi'

import { getMorePhotosAsync, getPeopleAsync, getPhotosAsync } from 'store/photos/actions'
import {
  selectHasMorePhotosByAlbumId,
  selectPeople,
  selectPhotosByAlbumId,
  selectPhotosPageByAlbumId,
  selectStatus,
} from 'store/photos/selectors'
import { selectStatus as selectStatusAlbums, selectAlbumById } from 'store/albums/selectors'

import useObserver from 'components/hooks/useObserver'
import { Image } from 'components/Image'
import PeopleSelect, { PeopleOptionType } from 'components/PeopleSelect'
import { LoadingButton } from '@mui/lab'
import { useDidMountEffect } from 'components/hooks/useDidMountEffect'
// import { convertFileToDataURL } from 'utils/convert-file-to-data-url'
// import { addPhotosByAlbumId } from 'store/photos/reducers'

const CurrentAlbum: FC = () => {
  const id = useParams<{ id: string }>().id || ''

  const dispatch = useDispatch()

  const sm = useMediaQuery('(min-width:600px)')
  const md = useMediaQuery('(min-width:900px)')
  const lg = useMediaQuery('(min-width:1200px)')

  const album = useSelector(selectAlbumById(id))
  const people = useSelector(selectPeople)
  const status = useSelector(selectStatus)
  const statusAlbums = useSelector(selectStatusAlbums)
  const photos = useSelector(selectPhotosByAlbumId(id))
  const page = useSelector(selectPhotosPageByAlbumId(id))
  const hasMorePhoto = useSelector(selectHasMorePhotosByAlbumId(id))

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState({ src: '', alt: '' })
  const [currentPeople, setCurrentPeople] = useState<PeopleOptionType[]>([])

  const [files, setFiles] = useState<UppyFile<Record<string, unknown>, Record<string, unknown>>[]>(
    [],
  )
  // const [fileKeys, setFileKeys] = useState<{ id: string; key: string }[]>([])

  const observerRef = useRef<HTMLDivElement>(null)
  const visible = useObserver(observerRef, '100px')

  const uppy = useUppy(() => {
    return new Uppy({
      id: 'addPhotosToAlbum',
      restrictions: {
        maxNumberOfFiles: 100,
      },
    }).use(AwsS3, {
      getUploadParameters: async (file: UppyFile) => {
        const typedFile = file as UppyFile & {
          people: string[]
          albumId: string
          photographerId: string
        }
        const api = ProtectedApi.getInstance()

        const { people, albumId, photographerId } = typedFile

        const photo: PhotosArray = [
          { photographerId },
          { albumId },
          { photoName: file.name },
          { 'Content-Type': file.type || 'image/jpg' },
        ]

        const [{ fields, url }] = await api.postPresignedPostPhotos({
          photosArray: [photo],
          people,
        })

        // setFileKeys([...fileKeys, { id: file.id, key: fields.key }])

        return Promise.resolve({
          method: 'POST',
          url,
          fields: {
            ...fields,
            // 'x-amz-fwd-header-Content-Disposition': `attachment; filename=${fields.key}`,
          },
        })
      },
    })
  })

  useEffect(() => {
    const filesAddedHandler = (uppyFiles: UppyFile[]) => {
      setFiles(uppyFiles)
    }

    const completeHandler = ({
      successful,
      failed,
    }: {
      successful: UppyFile[]
      failed: UppyFile[]
    }) => {
      console.log('successful files:', successful)
      console.log('failed files:', failed)

      if (!failed.length) {
        toast.success('All photos were successfully uploaded', { autoClose: 1500 })
      }
      setTimeout(() => {
        // successful.forEach(async (file) => {
        //   const typedFile = file as UppyFile & {
        //     albumId: string
        //     photographerId: string
        //   }
        //   uppy.removeFile(file.id)

        //   const imageDataUrl = await convertFileToDataURL(file.data)
        //   const id = fileKeys.find(({ id }) => file.id === id)?.key
        //   console.log('🚀 ~ successful.forEach ~ fileKeys', fileKeys)

        //   if (typedFile && imageDataUrl && id) {
        //     const photo = {
        //       albumId: typedFile.id,
        //       id: id.split('.')[0],
        //       name: file.name,
        //       photoLink: imageDataUrl.toString(),
        //       photoUrl: imageDataUrl.toString(),
        //       photographerId: typedFile.photographerId,
        //     }

        //     dispatch(addPhotosByAlbumId({ albumId: typedFile.id, newPhotosList: [photo] }))
        //   }
        // })

        const typedFile = successful[0] as UppyFile & {
          albumId: string
          photographerId: string
        }

        dispatch(getPhotosAsync({ albumId: typedFile.albumId }))
        setFiles([])
        // setFileKeys([])
      }, 3000)
    }

    uppy.on('files-added', filesAddedHandler)

    uppy.on('complete', completeHandler)

    return () => {
      uppy.off('files-added', filesAddedHandler)
      uppy.off('complete', completeHandler)
    }
  }, [])

  useEffect(() => {
    if (currentPeople.length) {
      files.forEach((file) => {
        uppy.setFileState(file.id, {
          people: currentPeople.map((p) => p.phone),
          albumId: album?.id || '',
          photographerId: album?.photographerId || '',
        })
      })
    }
  }, [currentPeople])

  useEffect(() => {
    if (!photos && album) {
      dispatch(getPhotosAsync({ albumId: album.id }))
    }
    if (!people) dispatch(getPeopleAsync())
  }, [photos, album, people])

  useDidMountEffect(() => {
    if (isUploading && status === APIStatus.FULFILLED) {
      setFiles([])
      setCurrentPeople([])
      setIsUploading(false)
    }

    if (isUploading && status === APIStatus.REJECTED) {
      setIsUploading(false)
    }
  }, [status])

  useDidMountEffect(() => {
    const isFieldsFull = Boolean(files.length) && Boolean(currentPeople.length)
    const isPhonesValid = currentPeople.every((p) => /^[0-9]{10,13}$/.test(p.phone))
    setIsPhoneValid(isFieldsFull && isPhonesValid)
  }, [files, currentPeople])

  useEffect(() => {
    if (visible && hasMorePhoto && status !== APIStatus.PENDING && photos && album) {
      dispatch(getMorePhotosAsync({ albumId: album.id, page }))
    }
  }, [visible, status, hasMorePhoto])

  const onClickUploadPhotos = () => {
    if (files.length && album) {
      uppy
        .upload()
        .then((res) => console.log('uppy res', res))
        .catch((err) => console.log('uppy err', err))
    }
  }

  const onClickPhoto = (src: string, alt: string) => () => {
    setCurrentPhoto({ src, alt })
    setIsDialogOpen(true)
  }
  const onClosePhoto = () => {
    setCurrentPhoto({ src: '', alt: '' })
    setIsDialogOpen(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Grid container>
        <Grid item xs sx={{ minWidth: 0, mb: '15px' }}>
          {statusAlbums === APIStatus.PENDING ? (
            <Skeleton
              variant='rounded'
              width={120}
              height={24}
              sx={{ bgcolor: '#eee' }}
              animation='wave'
            />
          ) : (
            <Name>{album?.name}</Name>
          )}
        </Grid>

        <Grid item sx={{ minWidth: 0 }}>
          {statusAlbums === APIStatus.PENDING ? (
            <Skeleton
              variant='rounded'
              width={70}
              height={12}
              sx={{ bgcolor: '#eee' }}
              animation='wave'
            />
          ) : (
            <Date>{moment(album?.date).format('DD.MM.YYYY')}</Date>
          )}
        </Grid>

        <Grid item xs={12} sx={{ minWidth: 0, mb: '15px' }}>
          {statusAlbums === APIStatus.PENDING ? (
            <Skeleton
              variant='rounded'
              width={180}
              height={16}
              sx={{ bgcolor: '#eee' }}
              animation='wave'
            />
          ) : (
            <Location>{album?.location}</Location>
          )}
        </Grid>
      </Grid>

      <Accordion disableGutters sx={{ '&:before': { opacity: 0 }, borderRadius: '4px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upload photos</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <UppyDashboardWrapper>
            <Dashboard uppy={uppy} hideUploadButton width={'100%'} height={'100%'} />
          </UppyDashboardWrapper>

          <Box mb='15px'>
            <PeopleSelect currentPeople={currentPeople} setCurrentPeople={setCurrentPeople} />
          </Box>

          <LoadingButton
            loading={isUploading}
            disabled={!isPhoneValid}
            loadingIndicator={
              <CircularProgress size={18} sx={{ position: 'absolute', top: '-9px', left: '2px' }} />
            }
            loadingPosition='end'
            fullWidth
            variant='contained'
            sx={{ flex: '1', borderRadius: '40px', height: '40px', marginRight: '10px' }}
            onClick={onClickUploadPhotos}
          >
            Upload photo
          </LoadingButton>
        </AccordionDetails>
      </Accordion>

      <Dialog
        scroll='body'
        open={isDialogOpen}
        onClose={onClosePhoto}
        PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}
      >
        <Image {...currentPhoto} />
      </Dialog>

      {photos && (
        <ImageList cols={lg ? 5 : md ? 4 : sm ? 3 : 2} gap={lg ? 12 : md ? 10 : sm ? 8 : 6}>
          {photos.map(({ id, name, photoLink }) => (
            <ImageListItem key={id} onClick={onClickPhoto(photoLink, name.split('_')[1])}>
              <Image
                onClick={onClosePhoto}
                height={200}
                iconSize={36}
                src={photoLink}
                alt={name.split('_')[1]}
                clickable
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <div
        className='observer-ref-upload-more-photo'
        ref={observerRef}
        style={{
          textAlign: 'center',
          width: '100%',
          opacity: hasMorePhoto && status === APIStatus.PENDING ? 1 : 0,
          fontSize: hasMorePhoto && status === APIStatus.PENDING ? '28px' : '0px',
        }}
      >
        Loading...
      </div>
    </motion.div>
  )
}

export default CurrentAlbum

const Name = styled(Typography)`
  color: #090909;
  line-height: 1.1;
  font-weight: 600;
  font-size: 20px;
  /* margin-bottom: 15px; */
  margin-right: 24px;
`

const Location = styled(Typography)`
  color: #141414;
  line-height: 1.2;
  font-size: 16px;
  /* margin-bottom: 15px; */
`

const Date = styled(Typography)`
  color: #444444;
  line-height: 26px;
  font-size: 13px;
  display: block;
  text-align: right;
`

const UppyDashboardWrapper = styled.div`
  margin-bottom: 15px;

  & .uppy-Dashboard-inner {
    border-radius: 8px;
  }

  & .uppy-Dashboard-AddFiles {
    border-radius: 7px;
  }
`
