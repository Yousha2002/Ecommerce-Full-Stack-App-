import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const getCartItems = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/cart')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity,flashSaleId }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/cart', { productId, quantity ,   flashSaleId })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/cart/${cartItemId}`, { quantity })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (cartItemId, { rejectWithValue }) => {
    try {
      await axios.delete(`/cart/${cartItemId}`)
      return cartItemId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete('/cart')
      return []
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(getCartItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(item => 
          item.productId === action.payload.cartItem.productId
        )
        if (existingItem) {
          existingItem.quantity = action.payload.cartItem.quantity
        } else {
          state.items.push(action.payload.cartItem)
        }
        state.error = null
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload
      })
      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const item = state.items.find(item => item.id === action.payload.cartItem.id)
        if (item) {
          item.quantity = action.payload.cartItem.quantity
        }
        state.error = null
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.error = action.payload
      })
      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload
      })
      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.error = null
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearCartError } = cartSlice.actions
export default cartSlice.reducer