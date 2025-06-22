import axios from 'axios'
import apiClient from '../utils/apiClient';

export const jobService = {
  // Get filter options from database
  async getFilterOptions() {
    try {
      const response = await apiClient.get(`job-seeker/job/filter-options/`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Filter options response:', response.data);
      return response.data
    } catch (error) {
      console.error('Error fetching filter options:', error.response?.data || error.message);
      throw error
    }
  },

  // Get provinces from database
  async getProvinces() {
    try {
      const response = await apiClient.get(`job-seeker/job/provinces/`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('Provinces response:', response.data);
      return response.data
    } catch (error) {
      console.error('Error fetching provinces:', error.response?.data || error.message);
      throw error
    }
  },

  // Search jobs with filters
  async searchJobs(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      // Add all filters as query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            if (filters[key].length > 0) {
              params.append(key, filters[key].join(','))
            }
          } else {
            params.append(key, filters[key])
          }
        }
      })
      
      const url = `job-seeker/job/search/?${params.toString()}`;
      console.log('🚀 Requesting jobs from:', url);
      console.log('📝 Filters sent:', filters);
      
      const response = await apiClient.get(url, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('✅ Jobs response:', response.data);
      console.log('📊 Number of jobs received:', response.data?.data?.jobs?.length || 0);
      
      if (response.data?.data?.jobs?.length > 0) {
        console.log('🔍 Sample job:', response.data.data.jobs[0]);
      } else {
        console.log('❌ No jobs found with current filters');
        console.log('🔧 Applied filters:', response.data?.data?.filters_applied);
      }
      console.log("here")
      return response.data
    } catch (error) {
      console.error('❌ Error searching jobs:', error.response?.data || error.message);
      if (error.response?.status) {
        console.error('Status:', error.response.status);
      }
      throw error
    }
  },

  // Get job recommendations for current user with filters
  async getRecommendedJobs(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      // Add all filters as query parameters
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          if (Array.isArray(filters[key])) {
            if (filters[key].length > 0) {
              params.append(key, filters[key].join(','))
            }
          } else {
            params.append(key, filters[key])
          }
        }
      })

      const url = `job-seeker/job/recommendations/?${params.toString()}`;
      
      const response = await apiClient.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        }
      })
      
      console.log('✅ Jobs response:', response.data);
      console.log('📊 Number of jobs received:', response.data?.data?.jobs?.length || 0);
      
      if (response.data?.data?.jobs?.length > 0) {
        console.log('🔍 Sample job:', response.data.data.jobs[0]);
      } else {
        console.log('❌ No jobs found with current filters');
        console.log('🔧 Applied filters:', response.data?.data?.filters_applied);
      }
      console.log("here")
      return response.data
    } catch (error) {
      console.error('❌ Error searching jobs:', error.response?.data || error.message);
      if (error.response?.status) {
        console.error('Status:', error.response.status);
      }
      throw error
    }
  },

  // Get job detail by 36 character ID suffix
  async getJobById(jobUrl) {
    try {
      console.log('🚀 Fetching job detail for ID:', jobUrl);

      const response = await apiClient.get(`job-seeker/job/detail`, {
        params: {
          url: jobUrl
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Job detail response:', response.data);
      
      if (response.data?.data?.job) {
        return response.data.data.job;
      } else {
        throw new Error('Job not found or invalid response format');
      }
    } catch (error) {
      console.error('❌ Error fetching job detail:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        throw new Error('Job not found');
      }
      throw error;
    }
  }
}