import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/wishlist', { productId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to wishlist')
    }
  }
)

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (wishlistItemId, { rejectWithValue }) => {
    try {
      await axios.delete(`/wishlist/${wishlistItemId}`)
      return wishlistItemId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from wishlist')
    }
  }
)

// Get wishlist
export const getWishlist = createAsyncThunk(
  'wishlist/get',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/wishlist')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch wishlist')
    }
  }
)

// Check if product is in wishlist
export const checkWishlist = createAsyncThunk(
  'wishlist/check',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/wishlist/check/${productId}`)
      return { productId, isInWishlist: response.data.isInWishlist }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to check wishlist')
    }
  }
)

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    checkingProducts: {} // Track which products are being checked
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null
    },
    clearWishlist: (state) => {
      state.items = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.unshift(action.payload.wishlistItem)
        state.error = null
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload
      })
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Check wishlist
      .addCase(checkWishlist.fulfilled, (state, action) => {
        const { productId, isInWishlist } = action.payload
        // Update the specific product in items if it exists
        const existingItem = state.items.find(item => item.productId === productId)
        if (existingItem) {
          existingItem.isInWishlist = isInWishlist
        }
      })
  },
})

export const { clearWishlistError, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer