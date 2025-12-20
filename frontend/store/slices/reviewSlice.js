import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../lib/axios'


//  Get all reviews for admin
export const getAllReviews = createAsyncThunk(
  'reviews/getAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/reviews/admin/all')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews')
    }
  }
)

//  Toggle review verification
export const toggleReviewVerification = createAsyncThunk(
  'reviews/toggleReviewVerification',
  async ({ reviewId, isVerified }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/reviews/admin/${reviewId}/verify`, { isVerified })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update review verification')
    }
  }
)

// Async thunks
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/reviews', reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add review')
    }
  }
)

export const getProductReviews = createAsyncThunk(
  'reviews/getProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/reviews/product/${productId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews')
    }
  }
)

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/reviews/${reviewId}`, reviewData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update review')
    }
  }
)

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await axios.delete(`/reviews/${reviewId}`)
      return reviewId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete review')
    }
  }
)

export const getUserReviews = createAsyncThunk(
  'reviews/getUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/reviews/user')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user reviews')
    }
  }
)

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    userReviews: [],
    currentProductReviews: [],
    ratingDistribution: [],
    totalReviews: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null
    },
    clearCurrentProductReviews: (state) => {
      state.currentProductReviews = []
      state.ratingDistribution = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload.review)
        state.error = null
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get Product Reviews
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProductReviews = action.payload.reviews
        state.ratingDistribution = action.payload.ratingDistribution
        state.totalReviews = action.payload.totalReviews
        state.error = null
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(item => item.id === action.payload.review.id)
        if (index !== -1) {
          state.items[index] = action.payload.review
        }
        state.error = null
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(item => item.id !== action.payload)
        state.error = null
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get User Reviews
      .addCase(getUserReviews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.userReviews = action.payload.reviews
        state.error = null
      })
      .addCase(getUserReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
          // Get All Reviews (Admin)
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload.reviews
        state.error = null
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Toggle Review Verification
      .addCase(toggleReviewVerification.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(toggleReviewVerification.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(item => item.id === action.payload.review.id)
        if (index !== -1) {
          state.items[index] = action.payload.review
        }
        // Also update in current product reviews if exists
        const productIndex = state.currentProductReviews.findIndex(item => item.id === action.payload.review.id)
        if (productIndex !== -1) {
          state.currentProductReviews[productIndex] = action.payload.review
        }
        state.error = null
      })
      .addCase(toggleReviewVerification.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearReviewError, clearCurrentProductReviews } = reviewSlice.actions
export default reviewSlice.reducer