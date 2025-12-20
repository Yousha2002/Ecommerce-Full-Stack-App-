import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/users')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users')
    }
  }
)

export const updateUserStatus = createAsyncThunk(
  'users/updateStatus',
  async ({ userId, isActive }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/users/${userId}/status`, { isActive })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user status')
    }
  }
)

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`/users/${userId}`)
      return userId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.user.id)
        if (index !== -1) {
          state.items[index] = action.payload.user
        }
        state.error = null
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.error = action.payload
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearUserError } = userSlice.actions
export default userSlice.reducer