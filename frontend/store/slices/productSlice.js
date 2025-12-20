import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async ({ category, featured, page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (featured) params.append('featured', featured)
      params.append('page', page)
      params.append('limit', limit)

      const response = await axios.get(`/products?${params}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/products/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product')
    }
  }
)

// export const createProduct = createAsyncThunk(
//   'products/create',
//   async (productData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/products', productData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       })
//       return response.data
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to create product')
//     }
//   }
// )
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      console.log('Sending product data...')
      const response = await axios.post('/products', productData, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        },
        timeout: 30000 // 30 second timeout
      })
      return response.data
    } catch (error) {
      console.error('Create product error:', error)
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          'Failed to create product'
      return rejectWithValue(errorMessage)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/products/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/products/${productId}`)
      return productId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete product')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalProducts: 0,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    clearProductError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.totalProducts = action.payload.totalProducts
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProduct = action.payload
        state.error = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload.product)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.product.id)
        if (index !== -1) {
          state.items[index] = action.payload.product
        }
        state.currentProduct = action.payload.product
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearCurrentProduct, clearProductError } = productSlice.actions
export default productSlice.reducer