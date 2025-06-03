import axios from 'axios';
import { getFromStorage } from '../utils/localStorage';

const API_BASE_URL = 'http://localhost:8000/api/';

export const reportService = {
  async sendReport({ job_url, reportType, reportDescriptions }) {
    try {
      const user_uid = getFromStorage('user-id'); // Ensure user is authenticated
      const payload = {
        user_uid,
        job_url,
        reportType,
        reportDescriptions,
      };
      const response = await axios.post(`${API_BASE_URL}jobs/report/`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};