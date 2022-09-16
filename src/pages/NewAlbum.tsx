import { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, TextField, TextFieldProps, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import moment, { Moment } from 'moment'

import { APIStatus } from 'api/MainApi'

import { useInput } from '../components/hooks/useInput'

import { selectStatus } from 'store/login/selectors'

import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

const NewAlbum: FC = () => {
  const dispatch = useDispatch()

  const status = useSelector(selectStatus)

  const [name, setName] = useInput('')
  const [location, setLocation] = useInput('')
  const [date, setDate] = useState<Moment | null>(null)

  const handleOnChangeDate = (value: Moment | null) => {
    setDate(value)
  }
  const handleOnClickSave = () => {
    console.log('🚀 ~ handleOnClickSave ~ handleOnClickSave', handleOnClickSave)
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
              fullWidth
              value={name}
              onChange={setName}
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
              fullWidth
              value={location}
              onChange={setLocation}
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
            <Button
              variant='contained'
              fullWidth
              sx={{ borderRadius: '50px', height: '50px' }}
              onClick={handleOnClickSave}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </motion.div>
  )
}

export default NewAlbum
