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
  Typography,
  useMediaQuery,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import moment from 'moment'

import { APIStatus } from 'api/MainApi'

import {
  getMorePhotosAsync,
  getPeopleAsync,
  getPhotosAsync,
  postUploadPhotosAsync,
} from 'store/photos/actions'
import {
  selectHasMorePhotosByAlbumId,
  selectPhotosByAlbumId,
  selectPhotosPageByAlbumId,
  selectStatus,
} from 'store/photos/selectors'
import { selectAlbumById } from 'store/albums/selectors'

import useObserver from 'components/hooks/useObserver'
import { Image } from 'components/Image'
import { DropZoneFiles, UploadDropZone } from 'components/UploadDropZone'
import PeopleSelect, { PeopleOptionType } from 'components/PeopleSelect'
import { LoadingButton } from '@mui/lab'
import { useDidMountEffect } from 'components/hooks/useDidMountEffect'

const CurrentAlbum: FC = () => {
  const id = +(useParams<{ id: string }>().id || '')

  const dispatch = useDispatch()

  const sm = useMediaQuery('(min-width:600px)')
  const md = useMediaQuery('(min-width:900px)')
  const lg = useMediaQuery('(min-width:1200px)')

  const album = useSelector(selectAlbumById(id))
  const status = useSelector(selectStatus)
  const photos = useSelector(selectPhotosByAlbumId(id))
  const page = useSelector(selectPhotosPageByAlbumId(id))
  const hasMorePhoto = useSelector(selectHasMorePhotosByAlbumId(id))

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPhoneValid, setIsPhoneValid] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState({ src: '', alt: '' })
  const [currentPeople, setCurrentPeople] = useState<PeopleOptionType[]>([])

  const [files, setFiles] = useState<DropZoneFiles[]>([])

  const observerRef = useRef<HTMLDivElement>(null)
  const visible = useObserver(observerRef, '100px')

  useEffect(() => {
    if (!photos && album) {
      dispatch(getPhotosAsync({ albumId: album.id }))
    }
    dispatch(getPeopleAsync())
  }, [])

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
      setIsUploading(true)

      dispatch(
        postUploadPhotosAsync({
          files,
          people: currentPeople.map((p) => p.phone),
          albumId: album.id,
        }),
      )
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
        <Grid item xs sx={{ minWidth: 0 }}>
          <Name>{album?.name}</Name>
        </Grid>

        <Grid item sx={{ minWidth: 0 }}>
          <Date>{moment(album?.date).format('DD.MM.YYYY')}</Date>
        </Grid>

        <Grid item xs={12} sx={{ minWidth: 0 }}>
          <Location>{album?.location}</Location>
        </Grid>
      </Grid>

      <Accordion disableGutters sx={{ '&:before': { opacity: 0 }, borderRadius: '4px' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Upload photos</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <Box mb='15px'>
            <UploadDropZone files={files} setFiles={setFiles} isUploading={isUploading} />
          </Box>

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
  margin-bottom: 15px;
  margin-right: 24px;
`

const Location = styled(Typography)`
  color: #141414;
  line-height: 1.2;
  font-size: 16px;
  margin-bottom: 15px;
`

const Date = styled(Typography)`
  color: #444444;
  line-height: 26px;
  font-size: 13px;
  display: block;
  text-align: right;
`
