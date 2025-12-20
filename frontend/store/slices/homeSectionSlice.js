
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axios';


export const fetchActiveSections = createAsyncThunk(
  'homeSections/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/home-sections/active');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sections');
    }
  }
);


export const fetchAllSections = createAsyncThunk(
  'homeSections/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/home-sections/admin/all');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sections');
    }
  }
);

export const createSection = createAsyncThunk(
  'homeSections/create',
  async (sectionData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/home-sections/admin', sectionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create section');
    }
  }
);


export const updateSection = createAsyncThunk(
  'homeSections/update',
  async ({ id, sectionData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/home-sections/admin/${id}`, sectionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update section');
    }
  }
);


export const deleteSection = createAsyncThunk(
  'homeSections/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/home-sections/admin/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete section');
    }
  }
);

const homeSectionSlice = createSlice({
  name: 'homeSections',
  initialState: {
    activeSections: [],
    allSections: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active sections
      .addCase(fetchActiveSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActiveSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSections = action.payload;
      })
      .addCase(fetchActiveSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch all sections (admin)
      .addCase(fetchAllSections.fulfilled, (state, action) => {
        state.allSections = action.payload;
      })
      // Create section
      .addCase(createSection.fulfilled, (state, action) => {
        state.allSections.push(action.payload.section);
      })
      // Update section
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.allSections.findIndex(
          section => section.id === action.payload.section.id
        );
        if (index !== -1) {
          state.allSections[index] = action.payload.section;
        }
      })
      // Delete section
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.allSections = state.allSections.filter(
          section => section.id !== action.payload
        );
      });
  },
});

export const { clearError } = homeSectionSlice.actions;
export default homeSectionSlice.reducer;