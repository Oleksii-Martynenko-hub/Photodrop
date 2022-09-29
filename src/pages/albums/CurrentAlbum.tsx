import { FC, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import moment from 'moment'

import { APIStatus } from 'api/MainApi'

import { getPeopleAsync, getPhotosAsync, postUploadPhotosAsync } from 'store/photos/actions'
import {
  selectPeople,
  selectPhotoCountByAlbumId,
  selectPhotosByAlbumId,
  selectStatus,
} from 'store/photos/selectors'
import { selectAlbumById } from 'store/albums/selectors'

import useObserver from 'components/hooks/useObserver'
import { Image } from 'components/Image'
import { DropZoneFiles, UploadDropZone } from 'components/UploadDropZone'

const CurrentAlbum: FC = () => {
  const id = +(useParams<{ id: string }>().id || '')

  const dispatch = useDispatch()

  const sm = useMediaQuery('(min-width:600px)')
  const md = useMediaQuery('(min-width:900px)')
  const lg = useMediaQuery('(min-width:1200px)')

  const album = useSelector(selectAlbumById(id))
  const status = useSelector(selectStatus)
  const photos = useSelector(selectPhotosByAlbumId(id))
  const people = useSelector(selectPeople)
  const count = useSelector(selectPhotoCountByAlbumId(id))

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPhoto, setCurrentPhoto] = useState({ src: '', alt: '' })
  const [hasMorePhoto, setHasMorePhoto] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const [files, setFiles] = useState<DropZoneFiles[]>([])

  const [currentPeople, setCurrentPeople] = useState<string[]>([])

  const observerRef = useRef<HTMLDivElement>(null)
  const visible = useObserver(observerRef, '100px')

  useEffect(() => {
    if (!photos && album) {
      dispatch(getPhotosAsync({ albumId: album.id, limit: 1000 }))
    }
    dispatch(getPeopleAsync())
  }, [])

  useEffect(() => {
    if (photos && count) {
      setHasMorePhoto(count > photos.length)
      setCurrentPage(Math.ceil(photos.length / 10))
    }
  }, [photos, count])

  useEffect(() => {
    console.log(files)
  }, [files])

  // useEffect(() => {
  //   if (visible && hasMorePhoto && status !== APIStatus.PENDING && photos && album) {
  //     console.log('🚀 ~ useEffect ~ visible', visible)
  //     console.log('🚀 ~ useEffect ~ currentPage', currentPage)
  //     dispatch(getPhotosAsync({ albumId: album.id, page: currentPage + 1 }))
  //   }
  // }, [visible])

  const onClickUploadPhotos = () => {
    if (files.length && album) {
      dispatch(
        postUploadPhotosAsync({
          files,
          people: currentPeople,
          albumId: album.id,
        }),
      )
    }
  }

  const handleChangePeople = (e: SelectChangeEvent<string[]>) => {
    const { value } = e.target
    setCurrentPeople(typeof value === 'string' ? value.split(',') : value)
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
          <FormControl fullWidth sx={{ marginBottom: '12px' }}>
            <Select
              multiple
              displayEmpty
              placeholder='People on photos'
              value={currentPeople}
              onChange={handleChangePeople}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em style={{ color: '#999' }}>People on photos</em>
                }

                return selected.join(', ')
              }}
              inputProps={{
                sx: {
                  backgroundColor: '#F4F4F4',
                  borderRadius: '6px !important',
                  height: '40px !important',
                  minHeight: '40px !important',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                },
              }}
              sx={{
                borderRadius: '6px !important',
              }}
            >
              {people.map(({ id, phone }) => (
                <MenuItem key={id} value={phone}>
                  {phone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={onClickUploadPhotos}>Upload</Button>

          <UploadDropZone files={files} setFiles={setFiles} />
        </AccordionDetails>
      </Accordion>

      <Dialog
        onClose={onClosePhoto}
        open={isDialogOpen}
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

      {/* {hasMorePhoto && ( */}
      <div
        className='observerRef'
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
      {/* )} */}
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
