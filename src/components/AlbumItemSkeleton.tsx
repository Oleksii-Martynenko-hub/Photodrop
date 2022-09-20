import { FC } from 'react'
import { Grid, Paper, Skeleton } from '@mui/material'
import { motion } from 'framer-motion'

const AlbumItemSkeleton: FC<{ index: number }> = ({ index }) => {
  return (
    <Grid item xs={12} md={6}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: index * 0.015 } }}
        exit={{ opacity: 0 }}
      >
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
      </motion.div>
    </Grid>
  )
}

export default AlbumItemSkeleton
