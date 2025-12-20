


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/categories')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories')
    }
  }
)


export const fetchProductsByCategory = createAsyncThunk(
  'categories/fetchProductsByCategory',
  async ({ categoryId, page = 1, limit = 12 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/categories/${categoryId}/products?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products by category')
    }
  }
)

export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/categories', categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create category')
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/categories/${id}`, categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update category')
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId, { rejectWithValue }) => {
    try {
      await axios.delete(`/categories/${categoryId}`)
      return categoryId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete category')
    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    currentCategory: null,
    categoryProducts: [],
    isLoading: false,
    error: null,
    productsLoading: false,
    productsError: null,
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null
    },
    clearProductsError: (state) => {
      state.productsError = null
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null
      state.categoryProducts = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Products by Category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productsLoading = true
        state.productsError = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsLoading = false
        state.currentCategory = action.payload.category
        state.categoryProducts = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.totalProducts = action.payload.totalProducts
        state.productsError = null
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productsLoading = false
        state.productsError = action.payload
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.unshift(action.payload.category)
        state.error = null
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.error = action.payload
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.category.id)
        if (index !== -1) {
          state.items[index] = action.payload.category
        }
        state.error = null
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.payload
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearCategoryError, clearProductsError, clearCurrentCategory } = categorySlice.actions
export default categorySlice.reducer