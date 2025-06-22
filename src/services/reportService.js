import axios from 'axios';
import { getFromStorage } from '../utils/localStorage';
import apiClient from '../utils/apiClient';

const API_BASE_URL = 'http://localhost:8000/api/';

export const reportService = {
  async sendReport({ job_url, reportType, reportDescriptions }) {
    try {
      const payload = {
        job_url,
        reportType,
        reportDescriptions,
      };
      const response = await apiClient.post(`report/create-report/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getFromStorage('user-token')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};