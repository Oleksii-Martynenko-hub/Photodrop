import { FC, useEffect } from 'react'
import { Box, Button, CircularProgress, Grid, useMediaQuery } from '@mui/material'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'

import { uniqBy } from 'utils/uniq-by'

import { Image } from 'components/Image'

export interface DropZoneFiles {
  name: string
  preview: string
  progress: number
  setUploadProgress: (progress: number, name: string) => void
  file: File
}

interface Props {
  files: DropZoneFiles[]
  setFiles: React.Dispatch<React.SetStateAction<DropZoneFiles[]>>
  isUploading: boolean
}

export const UploadDropZone: FC<Props> = ({ files, setFiles, isUploading }) => {
  const sm = useMediaQuery('(min-width:600px)')
  const md = useMediaQuery('(min-width:900px)')

  const setUploadProgress = (progress: number, name: string) => {
    setFiles((prev) => prev.map((file) => (file.name === name ? { ...file, progress } : file)))
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject, isFocused, fileRejections } =
    useDropzone({
      accept: {
        'image/*': [],
      },
      onDrop: (acceptedFiles) => {
        const updatedFiles = [
          ...files,
          ...acceptedFiles.map((file) => ({
            name: file.name,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            setUploadProgress,
          })),
        ]

        setFiles(updatedFiles)
        // setFiles(uniqBy<DropZoneFiles>(updatedFiles, 'name'))
      },
      validator: (file) => {
        if (files.some(({ name }) => file.name === name)) {
          return {
            code: 'duplicate-name',
            message: 'The filename should be unique',
          }
        }
        return null
      },
    })

  useEffect(() => {
    if (isDragReject) console.log('rejected files', fileRejections)
  }, [isDragReject, fileRejections])

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [])

  const handleOnClickFile = (name: string) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()

    setFiles(files.filter((file) => file.name !== name))
  }

  return (
    <section
      className='dropzone-image-upload-section'
      style={{ background: '#eee', padding: md ? '18px' : '10px', borderRadius: '6px' }}
    >
      <Box
        {...getRootProps({
          className: 'dropzone',
          style: {
            border: '2px dashed',
            borderColor: isDragActive
              ? '#53c653'
              : isDragReject
              ? '#db2b2b'
              : isFocused
              ? '#3300cc'
              : 'gray',
            padding: md ? '24px' : sm ? '16px' : '8px',
            borderRadius: '6px',
            position: 'relative',
            minHeight: '100px',
          },
        })}
      >
        <input {...getInputProps()} />
        {!files.length ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#999',
                width: '100%',
                padding: '25px',
                margin: '0',
                textAlign: 'center',
              }}
            >
              Drag &apos;n&apos; drop some files here, or click to select files
            </p>
          </motion.div>
        ) : (
          <Grid container spacing={md ? 3 : sm ? 2 : 1}>
            {files.map(({ preview, progress, name }) => (
              <Grid item xs={6} sm={4} md={3} key={name}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: '1px solid #282828',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      '&:hover': { outline: '2px solid #db2b2b' },
                    }}
                    onClick={handleOnClickFile(name)}
                  >
                    <Image
                      src={preview}
                      height={md ? 240 : sm ? 180 : 120}
                      onLoad={() => {
                        URL.revokeObjectURL(preview)
                      }}
                    />
                    {isUploading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: 'rgba(0, 0, 0, 0.7)',
                          width: '100%',
                          height: md ? '240px' : sm ? '180px' : '120px',
                          borderRadius: '4px',
                        }}
                      >
                        {progress === 100 ? (
                          <CheckCircleOutlineRoundedIcon
                            sx={{
                              fontSize: '56px',
                              color: '#53c653',
                            }}
                          />
                        ) : (
                          <CircularProgress
                            variant='determinate'
                            value={progress}
                            size={48}
                            thickness={5}
                            sx={{ color: '#53c653' }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                </motion.div>
              </Grid>
            ))}
            {files.length && (
              <Grid item xs={12}>
                <Button>Add more photos</Button>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </section>
  )
}
