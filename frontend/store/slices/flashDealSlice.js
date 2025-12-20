import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const fetchFlashDeals = createAsyncThunk(
  'flashDeals/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/flash-sales')
      return response.data.flashSales || response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch flash deals')
    }
  }
)

export const fetchActiveFlashDeals = createAsyncThunk(
  'flashDeals/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/flash-sales/active')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch active flash deals')
    }
  }
)

export const createFlashDeal = createAsyncThunk(
  'flashDeals/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/flash-sales', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.flashSale
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create flash deal')
    }
  }
)

export const updateFlashDeal = createAsyncThunk(
  'flashDeals/update',
  async ({ id, dealData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/flash-sales/${id}`, dealData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.flashSale
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update flash deal')
    }
  }
)

export const deleteFlashDeal = createAsyncThunk(
  'flashDeals/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/flash-sales/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete flash deal')
    }
  }
)

const flashDealSlice = createSlice({
  name: 'flashDeals',
  initialState: {
    items: [],
    activeDeals: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearFlashDealError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all flash deals
      .addCase(fetchFlashDeals.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchFlashDeals.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchFlashDeals.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch active flash deals
      .addCase(fetchActiveFlashDeals.fulfilled, (state, action) => {
        state.activeDeals = action.payload
      })
      // Create flash deal
      .addCase(createFlashDeal.fulfilled, (state, action) => {
        state.items.push(action.payload)
        state.error = null
      })
      .addCase(createFlashDeal.rejected, (state, action) => {
        state.error = action.payload
      })
      // Update flash deal
      .addCase(updateFlashDeal.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.error = null
      })
      .addCase(updateFlashDeal.rejected, (state, action) => {
        state.error = action.payload
      })
      // Delete flash deal
      .addCase(deleteFlashDeal.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteFlashDeal.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearFlashDealError } = flashDealSlice.actions
export default flashDealSlice.reducer