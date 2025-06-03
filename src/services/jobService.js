import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export const jobService = {
  // Get filter options from database
  async getFilterOptions() {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs/filter-options/`, {
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
      const response = await axios.get(`${API_BASE_URL}/jobs/provinces/`, {
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
      
      const url = `${API_BASE_URL}/jobs/search/?${params.toString()}`;
      console.log('🚀 Requesting jobs from:', url);
      console.log('📝 Filters sent:', filters);
      
      const response = await axios.get(url, {
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
      console.log('🚀 Requesting recommended jobs with filters:', filters);

      // Use token from localStorage for authenticated request
      const token = localStorage.getItem('token');
      
      // Get user email from localStorage
      const userEmail = localStorage.getItem('user-email');
      
      if (!userEmail) {
        throw new Error('User email not found. Please login again.');
      }
      
      // Include user email in the request body
      const requestData = {
        ...filters,
        user_email: userEmail
      };
      
      console.log('📧 Including user email:', userEmail);
      
      const response = await axios.post(`${API_BASE_URL}/jobs/recommendations/`, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      console.log('✅ Recommended jobs response:', response.data);
      console.log('📊 Number of recommended jobs received:', response.data?.data?.jobs?.length || 0);
      
      if (response.data?.data?.jobs?.length > 0) {
        console.log('🔍 Sample recommended job:', response.data.data.jobs[0]);
      } else {
        console.log('❌ No recommended jobs found with current filters');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error getting job recommendations:', error.response?.data || error.message);
      if (error.response?.status) {
        console.error('Status:', error.response.status);
      }
      throw error;
    }
  },

  // Get job detail by 36 character ID suffix
  async getJobById(jobIdSuffix) {
    try {
      console.log('🚀 Fetching job detail for ID:', jobIdSuffix);

      const response = await axios.get(`${API_BASE_URL}/jobs/detail/`, {
        params: {
          id: jobIdSuffix
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Job detail response:', response.data);
      
      if (response.data?.success && response.data?.data?.job) {
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