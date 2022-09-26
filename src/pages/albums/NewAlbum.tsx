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

import { selectErrors, selectStatus } from 'store/albums/selectors'
import { postCreateAlbumAsync } from 'store/albums/actions'

import { useInput } from 'components/hooks/useInput'
import { useDidMountEffect } from 'components/hooks/useDidMountEffect'

const NewAlbum: FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const status = useSelector(selectStatus)
  const errors = useSelector(selectErrors)

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
      navigate(-1)
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
