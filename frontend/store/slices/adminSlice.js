import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const fetchDashboardStats = createAsyncThunk(
  'admin/dashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/dashboard')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard stats')
    }
  }
)

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalCategories: 0,
      totalOrders: 0,
      totalRevenue: '0.00'
    },
    recentProducts: [],
    recentUsers: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload.stats
        state.recentProducts = action.payload.recentProducts
        state.recentUsers = action.payload.recentUsers
        state.error = null
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer