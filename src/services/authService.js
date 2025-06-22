import axios from 'axios';
import { getFromStorage } from '../utils/localStorage';
import apiClient from '../utils/apiClient';

export const authService = {
  // Check if email is available
  async checkEmailAvailability(email) {
    try {
      const response = await apiClient.post(
        `/auth/check-email/`,
        {
          email: email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        // Email already exists
        return {
          available: false,
          message: error.response.data.message || 'Email already exists',
        };
      }
      throw error;
    }
  },

  async login(email, password) {
    try {
      const response = await apiClient.post(
        `/auth/sign-in/`,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register user with skills and profile picture
  async register(formData) {
    try {
      const response = await apiClient.post(`/auth/sign-up/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getDefaultProfile() {
    try {
      const token = localStorage.getItem('user-token');
      const response = await apiClient.get(`job-seeker/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile({ name, skills, profile_image }) {
    try {
      const formData = new FormData();
      const token = localStorage.getItem('user-token');
      const uid = getFromStorage('user-id');
      if (name) formData.append('name', name);
      if (skills && skills.length > 0) {
        skills.forEach(skill => formData.append('skills', skill));
      }
      if (profile_image) formData.append('profile_image', profile_image);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await apiClient.put(`job-seeker/profile/${uid}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
