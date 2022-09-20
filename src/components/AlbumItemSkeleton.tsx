import { FC } from 'react'
import { Grid, Paper, Skeleton } from '@mui/material'

const AlbumItemSkeleton: FC = () => {
  return (
    <Grid item xs={12}>
      <Paper variant='elevation' sx={{ padding: '8px', display: 'flex' }}>
        <Grid container spacing={1}>
          <Grid item>
            <Skeleton
              variant='rounded'
              width={80}
              height={60}
              sx={{ bgcolor: '#eee' }}
              animation='wave'
            />
          </Grid>

          <Grid item xs>
            <Grid container direction='column' spacing={1}>
              <Grid item>
                <Skeleton
                  variant='rounded'
                  width='110px'
                  height={22}
                  sx={{ bgcolor: '#eee' }}
                  animation='wave'
                />
              </Grid>

              <Grid item>
                <Skeleton
                  variant='rounded'
                  width='170px'
                  height={14}
                  sx={{ bgcolor: '#eee' }}
                  animation='wave'
                />
              </Grid>

              <Grid item alignSelf='flex-end'>
                <Skeleton
                  variant='rounded'
                  width='80px'
                  height={8}
                  sx={{ bgcolor: '#eee' }}
                  animation='wave'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  )
}

export default AlbumItemSkeleton
