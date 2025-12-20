import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = ({ 
  size = 40, 
  message = 'Loading...',
  fullScreen = false 
}) => {
  const content = (
    <Box className="flex flex-col items-center justify-center p-4">
      <CircularProgress size={size} className="mb-2" />
      {message && (
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  )

  if (fullScreen) {
    return (
      <Box className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </Box>
    )
  }

  return content
}

export default LoadingSpinner