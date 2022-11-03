import { FC, useState } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import {
  CircularProgress,
  FormHelperText,
  Grid,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { motion } from 'framer-motion'
import moment, { Moment } from 'moment'

import { APIStatus } from 'api/MainApi'

import { postCreateAlbumAsync } from 'store/albums/actions' // TODO: temporary
import { selectErrors, selectStatus } from 'store/albums/selectors'

import { useInput } from 'components/hooks/useInput'
import { useDidMountEffect } from 'components/hooks/useDidMountEffect'
import { selectLogin } from 'store/user/selectors' // TODO: temporary

const mockAlbums = [
  // TODO: temporary
  {
    name: 'Sundance Film Festival',
    location: 'Park City, Utah',
    date: '2022-01-21T08:49:52z',
  },
  {
    name: 'Super Bowl Sunday',
    location: 'Hard Rock Stadium, Miami, Florida',
    date: '2018-10-19T08:27:32z',
  },
  {
    name: 'Mardi Gras',
    location: 'New Orleans, Louisiana',
    date: '2021-07-23T06:05:19z',
  },
  {
    name: 'Masters Golf Tournament',
    location: 'Augusta National Gold Club, Georgia',
    date: '2021-02-09T05:33:33z',
  },
  {
    name: 'Coachella',
    location: 'Empire Polo Club in Indio, California',
    date: '2022-06-22T09:31:01z',
  },
  {
    name: 'The Boston Marathon',
    location: 'Boston, Massachusetts',
    date: '2017-05-02T09:26:08z',
  },
  {
    name: 'Independence Day',
    location: 'Throughout the USA',
    date: '2018-12-09T05:05:31z',
  },
  {
    name: 'Comic-Con International',
    location: 'San Diego, California',
    date: '2017-02-08T06:20:34z',
  },
  {
    name: 'Lollapalooza',
    location: 'Chicago, Illinois',
    date: '2018-07-24T08:30:28z',
  },
  {
    name: 'Burning Man Festival',
    location: 'Black Rock Desert, Nevada',
    date: '2020-12-26T05:34:16z',
  },
  {
    name: 'US Open Tennis Championships',
    location: 'USTA Billie Jean King National Tennis Center, New York',
    date: '2017-01-27T02:54:07z',
  },
  {
    name: 'Halloween',
    location: 'Lafayette Walk, Wheaton, Utah',
    date: '2020-11-11T06:44:05z',
  },
  {
    name: 'Thanksgiving Day',
    location: 'Fairview Place, Nevada',
    date: '2018-04-19T03:56:01z',
  },
  {
    name: 'New Year’s Eve in Times Square',
    location: 'Times Square, New York',
    date: '2020-01-19T10:39:31z',
  },
  {
    name: 'Jane Smith photo session on Bridge',
    location: 'Brooklyn Bridge',
    date: '2022-01-10T06:30:22z',
  },
  {
    name: 'Jane Smith, Botanical Garden',
    location: 'Brooklyn Botanical Garden',
    date: '2022-05-12T06:30:22z',
  },
] as const

const NewAlbum: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const status = useSelector(selectStatus)
  const errors = useSelector(selectErrors)
  const login = useSelector(selectLogin) // TODO: temporary

  const [name, setName] = useInput('')
  const [location, setLocation] = useInput('')
  const [date, setDate] = useState<Moment | null>(null)

  const [validation, setValidation] = useState({ isValid: true, message: '' })

  useDidMountEffect(() => {
    setValidation({ isValid: true, message: '' })
  }, [name, location, date])

  useDidMountEffect(() => {
    if (status === APIStatus.FULFILLED) {
      setName.setState('')
      setLocation.setState('')
      setDate(null)
      setValidation({ isValid: true, message: '' })
      navigate(-1) // TODO: temporary
    }

    if (status === APIStatus.REJECTED) {
      errors.forEach((error) => {
        if (error.msg === 'The album with this name already exist') {
          setValidation({ isValid: false, message: '' })
        }
      })
    }
  }, [status])

  const handleOnChangeDate = (value: Moment | null) => setDate(value)

  const handleOnClickSave = async () => {
    if (!name || !location || !date) {
      return setValidation({ isValid: false, message: 'All of the fields are required.' })
    }

    await dispatch(postCreateAlbumAsync({ name, location, date: moment(date).utc().format() }))
  }

  const handleOnClickGenerate = async () => {
    // TODO: temporary
    for (let i = 0; i < mockAlbums.length; i++) {
      const { name, location, date } = mockAlbums[i]
      await dispatch(
        postCreateAlbumAsync({
          name: name + ' test 1',
          location,
          date: moment(date).utc().format(),
        }),
      )
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Grid container justifyContent='center'>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          justifyContent='center'
          sx={{ flex: { xs: '0 1 400px', md: '0 0 600px' } }}
        >
          <Grid item xs={12} md={12}>
            <Typography variant='h4' align='center' gutterBottom>
              Create new album
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              placeholder='Name'
              error={!validation.isValid}
              fullWidth
              value={name}
              onChange={setName.onChange}
              InputProps={{
                sx: {
                  backgroundColor: '#F4F4F4',
                  borderRadius: '10px',
                  height: '40px',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              placeholder='Location'
              error={!validation.isValid}
              fullWidth
              value={location}
              onChange={setLocation.onChange}
              InputProps={{
                sx: {
                  backgroundColor: '#F4F4F4',
                  borderRadius: '10px',
                  height: '40px',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDatePicker
                value={date}
                onChange={handleOnChangeDate}
                renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
                  <TextField
                    {...params}
                    error={!validation.isValid}
                    placeholder='Date'
                    fullWidth
                    InputProps={{
                      sx: {
                        backgroundColor: '#F4F4F4',
                        borderRadius: '10px',
                        height: '40px',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={10} md={8}>
            <LoadingButton
              loading={status === APIStatus.PENDING}
              loadingIndicator={
                <CircularProgress
                  size={18}
                  sx={{ color: 'inherit', position: 'absolute', top: '-9px', left: '2px' }}
                />
              }
              loadingPosition='end'
              variant='contained'
              fullWidth
              sx={{ borderRadius: '50px', height: '50px', marginBottom: '10px' }}
              onClick={handleOnClickSave}
            >
              Save
            </LoadingButton>

            {(login === 'bkrevsun' || login === 'oleksii') && ( // TODO: temporary
              <LoadingButton
                loading={status === APIStatus.PENDING}
                loadingIndicator={
                  <CircularProgress
                    size={18}
                    sx={{ color: 'inherit', position: 'absolute', top: '-9px', left: '2px' }}
                  />
                }
                loadingPosition='end'
                variant='contained'
                fullWidth
                sx={{ borderRadius: '50px', height: '50px', marginBottom: '10px' }}
                onClick={handleOnClickGenerate}
              >
                Generate
              </LoadingButton>
            )}

            {!validation.isValid && validation.message && (
              <FormHelperText error={!validation.isValid} sx={{ textAlign: 'center' }}>
                {validation.message}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default NewAlbum
