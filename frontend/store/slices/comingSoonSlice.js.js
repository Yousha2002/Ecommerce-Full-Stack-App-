import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axios';

export const fetchComingSoonSections = createAsyncThunk(
  'comingSoon/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/coming-soon');
      return response.data.comingSoonSections || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch coming soon sections');
    }
  }
);

export const fetchActiveComingSoon = createAsyncThunk(
  'comingSoon/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/coming-soon/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch active coming soon sections');
    }
  }
);

export const createComingSoon = createAsyncThunk(
  'comingSoon/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/coming-soon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.comingSoon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create coming soon section');
    }
  }
);

export const updateComingSoon = createAsyncThunk(
  'comingSoon/update',
  async ({ id, sectionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/coming-soon/${id}`, sectionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.comingSoon;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update coming soon section');
    }
  }
);

export const deleteComingSoon = createAsyncThunk(
  'comingSoon/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/coming-soon/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete coming soon section');
    }
  }
);

const comingSoonSlice = createSlice({
  name: 'comingSoon',
  initialState: {
    items: [],
    activeSections: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearComingSoonError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all coming soon sections
      .addCase(fetchComingSoonSections.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComingSoonSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchComingSoonSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch active coming soon sections
      .addCase(fetchActiveComingSoon.fulfilled, (state, action) => {
        state.activeSections = action.payload;
      })
      // Create coming soon section
      .addCase(createComingSoon.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createComingSoon.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update coming soon section
      .addCase(updateComingSoon.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateComingSoon.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete coming soon section
      .addCase(deleteComingSoon.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteComingSoon.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearComingSoonError } = comingSoonSlice.actions;
export default comingSoonSlice.reducer;