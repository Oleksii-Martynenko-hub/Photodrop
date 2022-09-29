import { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar as Bar, IconButton, SxProps, Theme, Toolbar } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

import { logoutAsync } from 'store/login/actions'
import { selectIsLoggedIn } from 'store/login/selectors'

import useToggle from 'components/hooks/useToggle'

import { Logo } from 'components/Logo'
import HideOnScroll from 'components/HideOnScroll'
import { useDropzone } from 'react-dropzone'

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
}

export const UploadDropZone: FC<Props> = ({ files, setFiles }) => {
  const [isShowBackButton, setIsShowBackButton] = useToggle(false)

  const setUploadProgress = (progress: number, name: string) => {
    setFiles((prev) => prev.map((file) => (file.name === name ? { ...file, progress } : file)))
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) => ({
          name: file.name,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          setUploadProgress,
        })),
      )
    },
  })

  useEffect(() => {
    console.log(getRootProps(), getInputProps())
  }, [])

  const thumbs = files.map(({ preview, progress, name }) => (
    <div
      style={{
        display: 'inline-flex',
        borderRadius: 4,
        border: '1px solid #999',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box',
      }}
      key={name}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <p style={{ lineHeight: 1, margin: 0, textAlign: 'center' }}>{progress}%</p>
        <img
          src={preview}
          style={{
            display: 'block',
            height: '100%',
            width: 'auto',
            borderRadius: 4,
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(preview)
          }}
        />
      </div>
    </div>
  ))

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview))
  }, [])

  return (
    <section
      className='container'
      style={{ background: '#eee', padding: '10px', borderRadius: '6px' }}
    >
      <div
        {...getRootProps({
          className: 'dropzone',
          style: {
            border: '2px dashed gray',
            padding: '10px',
            borderRadius: '6px',
            position: 'relative',
            minHeight: '100px',
          },
        })}
      >
        <input {...getInputProps()} />
        {!files.length && (
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
        )}
        <aside
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {thumbs}
        </aside>
      </div>
    </section>
  )
}
