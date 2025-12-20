'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  Alert,
  InputAdornment,
  Chip,
  CircularProgress,
} from '@mui/material'
import { CloudUpload, Delete, Category, Description } from '@mui/icons-material'
import { useForm } from 'react-hook-form'


const COLORS = {
  primary: '#C9B59C',
  lightBg: '#F9F8F6',
  secondaryBg: '#EFE9E3',
  border: '#D9CFC7',
  text: '#5D4037',
  textLight: '#8D6E63',
  success: '#10B981',
  error: '#EF4444',
};

const CategoryForm = ({ category, onSubmit, onCancel, isLoading = false }) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm()
  const [imagePreview, setImagePreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const nameValue = watch('name', '')

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
      })
      if (category.image) {
        setImagePreview(category.image)
      }
    } else {
      reset({
        name: '',
        description: '',
      })
      setImagePreview('')
      setImageFile(null)
    }
  }, [category, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
  }

  const onSubmitForm = (data) => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('description', data.description || '')
    
    if (imageFile) {
      formData.append('image', imageFile)
    }

    onSubmit(formData)
  }

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmitForm)} 
      className="space-y-6"
      sx={{ backgroundColor: COLORS.lightBg }}
    >
      <Paper 
        className="p-6 border-1"
        sx={{ 
          backgroundColor: 'white',
          borderColor: COLORS.border,
          borderRadius: '16px'
        }}
      >
        <Box className="flex items-center gap-3 mb-6">
          <Box 
            className="p-2 rounded-lg"
            sx={{ backgroundColor: COLORS.primary }}
          >
            <Category sx={{ color: 'white' }} />
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: COLORS.text,
              fontWeight: 600
            }}
          >
            Category Information
          </Typography>
        </Box>

        <Alert 
          severity="info" 
          className="mb-6"
          sx={{ 
            backgroundColor: COLORS.secondaryBg,
            color: COLORS.text,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            '& .MuiAlert-icon': { color: COLORS.primary }
          }}
        >
          Image upload is optional. You can add it later if needed.
        </Alert>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Category Name"
              {...register('name', {
                required: 'Category name is required',
                minLength: {
                  value: 2,
                  message: 'Category name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Category name must be less than 50 characters'
                }
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category sx={{ color: COLORS.textLight }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: COLORS.lightBg,
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.primary,
                  },
                },
                marginBottom: 3
              }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              {...register('description', {
                maxLength: {
                  value: 200,
                  message: 'Description must be less than 200 characters'
                }
              })}
              placeholder="Describe this category..."
              error={!!errors.description}
              helperText={errors.description?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description sx={{ color: COLORS.textLight, mt: 1, alignSelf: 'flex-start' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: COLORS.lightBg,
                  '&:hover fieldset': {
                    borderColor: COLORS.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: COLORS.primary,
                  },
                },
              }}
            />

            {/* Character Count */}
            <Box className="flex justify-between items-center mt-2">
              <Chip 
                label={`${nameValue.length}/50`}
                size="small"
                variant="outlined"
                sx={{ 
                  borderColor: nameValue.length > 50 ? COLORS.error : COLORS.border,
                  color: nameValue.length > 50 ? COLORS.error : COLORS.textLight
                }}
              />
              <Typography variant="caption" sx={{ color: COLORS.textLight }}>
                Required fields are marked with *
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography 
              variant="subtitle1" 
              className="mb-4 font-medium"
              sx={{ color: COLORS.text }}
            >
              Category Image
              <Typography 
                component="span" 
                variant="caption"
                sx={{ color: COLORS.textLight, ml: 1 }}
              >
                (Optional)
              </Typography>
            </Typography>

            {imagePreview ? (
              <Box className="relative">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-full h-48 object-cover rounded-xl mb-2 shadow-md"
                />
                <IconButton
                  className="absolute top-2 right-2 shadow-lg"
                  onClick={removeImage}
                  sx={{ 
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: COLORS.secondaryBg
                    }
                  }}
                >
                  <Delete sx={{ color: COLORS.error }} />
                </IconButton>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                className="h-48 border-2 border-dashed rounded-xl"
                sx={{
                  borderColor: COLORS.border,
                  color: COLORS.textLight,
                  backgroundColor: COLORS.lightBg,
                  '&:hover': {
                    borderColor: COLORS.primary,
                    backgroundColor: COLORS.secondaryBg
                  }
                }}
              >
                <Box className="text-center">
                  <CloudUpload sx={{ fontSize: 48, color: COLORS.border, mb: 1 }} />
                  <Typography variant="body2" sx={{ color: COLORS.text }}>
                    Upload Image
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textLight }}>
                    PNG, JPG, WEBP (max 5MB)
                  </Typography>
                </Box>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            )}

            <Box className="mt-3 p-3 rounded-lg" sx={{ backgroundColor: COLORS.secondaryBg }}>
              <Typography variant="caption" sx={{ color: COLORS.text }}>
                <strong>Recommendations:</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textLight, display: 'block' }}>
                • Square images work best
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textLight, display: 'block' }}>
                • Use high-quality images
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textLight, display: 'block' }}>
                • Max file size: 5MB
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box className="flex justify-end space-x-3 gap-2  pt-4">
        <Button 
          onClick={onCancel} 
          variant="outlined"
          disabled={isLoading}
          sx={{
            borderRadius: '12px',
            borderColor: COLORS.border,
            color: COLORS.text,
            '&:hover': {
              borderColor: COLORS.primary,
              backgroundColor: COLORS.secondaryBg
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : null}
          sx={{
            borderRadius: '12px',
            backgroundColor: COLORS.primary,
            color: 'white',
            '&:hover': {
              backgroundColor: COLORS.text,
            },
            '&:disabled': {
              backgroundColor: COLORS.border,
            }
          }}
        >
          {isLoading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
        </Button>
      </Box>
    </Box>
  )
}

export default CategoryForm