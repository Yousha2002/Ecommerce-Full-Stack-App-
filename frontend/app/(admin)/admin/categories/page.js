'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  Chip,
  Snackbar,
  InputBase,
  Card,
  Skeleton,
  Tooltip,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Image as ImageIcon,
  Search,
  FilterList,
  Refresh,
} from '@mui/icons-material'
import { useAppSelector, useAppDispatch } from '../../../../store/hooks'
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  clearCategoryError,
} from '../../../../store/slices/categorySlice'
import CategoryForm from '../../../../components/forms/CategoryForm'
import ProtectedRoute from '../../../../components/auth/ProtectedRoute'

// Color theme
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

export default function AdminCategories() {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const dispatch = useAppDispatch()
  const { items: categories, isLoading, error } = useAppSelector((state) => state.categories)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingCategory(null)
    setIsSubmitting(false)
    dispatch(clearCategoryError())
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, categoryData: formData })).unwrap()
        setSuccessMessage('Category updated successfully!')
      } else {
        await dispatch(createCategory(formData)).unwrap()
        setSuccessMessage('Category created successfully!')
      }
      handleCloseDialog()
      dispatch(fetchCategories())
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap()
        setSuccessMessage('Category deleted successfully!')
        dispatch(fetchCategories())
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleCloseSuccess = () => {
    setSuccessMessage('')
  }

  const handleRefresh = () => {
    dispatch(fetchCategories())
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute requireAdmin>
      <Box sx={{ backgroundColor: COLORS.lightBg, minHeight: '100vh', p: 3 }}>
        {/* Header Section */}
        <Card 
          sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '16px',
            backgroundColor: 'white',
            border: `1px solid ${COLORS.border}`,
            background: `linear-gradient(135deg, ${COLORS.lightBg} 0%, white 100%)`
          }}
        >
          <Box className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  color: COLORS.text,
                  mb: 1
                }}
              >
                Categories Management
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ color: COLORS.textLight }}
              >
                Manage your product categories and organization
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: '12px',
                backgroundColor: COLORS.primary,
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: COLORS.text,
                }
              }}
            >
              Add Category
            </Button>
          </Box>

          {/* Search and Controls */}
          <Box className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <Paper
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '100%', md: 400 },
                borderRadius: '12px',
                border: `1px solid ${COLORS.border}`,
                backgroundColor: COLORS.lightBg
              }}
            >
              <InputBase
                sx={{ ml: 2, flex: 1, color: COLORS.text }}
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startAdornment={
                  <Search sx={{ color: COLORS.textLight, mr: 1 }} />
                }
              />
            </Paper>
            
            <Box className="flex gap-2">
              <Tooltip title="Refresh">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={isLoading}
                  sx={{ 
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '10px',
                    color: COLORS.text
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Button
                startIcon={<FilterList />}
                sx={{
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '10px',
                  color: COLORS.text,
                  textTransform: 'none'
                }}
              >
                Filter
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4, 
              borderRadius: '12px',
              border: `1px solid ${COLORS.error}`
            }}
            onClose={() => dispatch(clearCategoryError())}
          >
            {error}
          </Alert>
        )}

        {/* Categories Table */}
        <Card 
          sx={{ 
            borderRadius: '16px',
            border: `1px solid ${COLORS.border}`,
            overflow: 'hidden'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: COLORS.secondaryBg }}>
                <TableRow>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Image</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Description</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: COLORS.text, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  // Loading Skeletons
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton variant="circular" width={40} height={40} /></TableCell>
                      <TableCell><Skeleton variant="text" width={120} /></TableCell>
                      <TableCell><Skeleton variant="text" width={200} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} sx={{ ml: 1 }} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredCategories.map((category) => (
                  <TableRow 
                    key={category.id}
                    sx={{ 
                      '&:hover': { backgroundColor: COLORS.secondaryBg },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: COLORS.lightBg,
                            borderRadius: '12px'
                          }}
                        >
                          <ImageIcon sx={{ color: COLORS.textLight }} />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.text }}>
                        {category.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: category.description ? COLORS.text : COLORS.textLight,
                          maxWidth: 300
                        }}
                        className="line-clamp-2"
                      >
                        {category.description || 'No description provided'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={category.isActive ? 'Active' : 'Inactive'}
                        color={category.isActive ? 'success' : 'default'}
                        size="small"
                        sx={{ 
                          borderRadius: '8px',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit Category">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(category)}
                          sx={{ 
                            color: COLORS.primary,
                            '&:hover': { backgroundColor: COLORS.secondaryBg }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Category">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(category.id)}
                          sx={{ 
                            '&:hover': { backgroundColor: '#FEF2F2' }
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Empty State */}
          {!isLoading && filteredCategories.length === 0 && (
            <Box className="text-center py-12">
              <Box 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: COLORS.secondaryBg,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <ImageIcon sx={{ fontSize: 40, color: COLORS.textLight }} />
              </Box>
              <Typography variant="h6" sx={{ color: COLORS.text, mb: 2 }}>
                {searchTerm ? 'No categories found' : 'No categories yet'}
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textLight, mb: 4, maxWidth: 400, mx: 'auto' }}>
                {searchTerm 
                  ? 'Try adjusting your search terms to find what you\'re looking for.'
                  : 'Get started by creating your first product category to organize your products.'
                }
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: COLORS.primary,
                    color: 'white',
                    px: 4,
                    '&:hover': {
                      backgroundColor: COLORS.text,
                    }
                  }}
                >
                  Create First Category
                </Button>
              )}
            </Box>
          )}
        </Card>

        {/* Add/Edit Category Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              backgroundColor: COLORS.lightBg
            }
          }}
        >
          <DialogTitle
            sx={{
              backgroundColor: 'white',
              borderBottom: `0px solid ${COLORS.border}`,
              color: COLORS.text,
              fontWeight: 600
            }}
          >
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent sx={{ p: 1 }}>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Success Message Snackbar */}
        <Snackbar
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSuccess} 
            severity="success" 
            sx={{ 
              width: '100%',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              border: `1px solid ${COLORS.success}`
            }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ProtectedRoute>
  )
}