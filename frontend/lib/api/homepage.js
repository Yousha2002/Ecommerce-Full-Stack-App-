import axios from '../axios';

// Homepage Sections APIs
export const homepageAPI = {
  // Public APIs - Frontend ke liye
  getHomepageSections: async () => {
    try {
      const response = await axios.get('/homepage/sections');
      return response.data;
    } catch (error) {
      console.error('API Error - getHomepageSections:', error.response?.data || error.message);
      throw error;
    }
  },

  getActiveBanners: async () => {
    try {
      const response = await axios.get('/homepage/banners');
      return response.data;
    } catch (error) {
      console.error('API Error - getActiveBanners:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin APIs - Sections
  getAllSections: async () => {
    try {
      const response = await axios.get('/homepage/admin/sections');
      return response.data;
    } catch (error) {
      console.error('API Error - getAllSections:', error.response?.data || error.message);
      throw error;
    }
  },

  createSection: async (sectionData) => {
    try {
      const response = await axios.post('/homepage/admin/sections', sectionData);
      return response.data;
    } catch (error) {
      console.error('API Error - createSection:', error.response?.data || error.message);
      throw error;
    }
  },

  updateSection: async (id, sectionData) => {
    try {
      const response = await axios.put(`/homepage/admin/sections/${id}`, sectionData);
      return response.data;
    } catch (error) {
      console.error('API Error - updateSection:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteSection: async (id) => {
    try {
      const response = await axios.delete(`/homepage/admin/sections/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error - deleteSection:', error.response?.data || error.message);
      throw error;
    }
  },

  reorderSections: async (sections) => {
    try {
      const response = await axios.put('/homepage/admin/sections/reorder', { sections });
      return response.data;
    } catch (error) {
      console.error('API Error - reorderSections:', error.response?.data || error.message);
      throw error;
    }
  },

  // Admin APIs - Banners
  getAllBanners: async () => {
    try {
      const response = await axios.get('/homepage/admin/banners');
      return response.data;
    } catch (error) {
      console.error('API Error - getAllBanners:', error.response?.data || error.message);
      throw error;
    }
  },

  createBanner: async (formData) => {
    try {
      const response = await axios.post('/homepage/admin/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('API Error - createBanner:', error.response?.data || error.message);
      throw error;
    }
  },

  updateBanner: async (id, formData) => {
    try {
      const response = await axios.put(`/homepage/admin/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('API Error - updateBanner:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteBanner: async (id) => {
    try {
      const response = await axios.delete(`/homepage/admin/banners/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error - deleteBanner:', error.response?.data || error.message);
      throw error;
    }
  }
};