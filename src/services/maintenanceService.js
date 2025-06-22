import axios from 'axios';
import apiClient from '../utils/apiClient';

const API_BASE_URL = 'http://localhost:8000/api';

export const maintenanceService = {
  async getMaintenanceStatus() {
    try {
      const response = await apiClient.get(`maintenance/status/`);
      // Kembalikan sesuai responsenya (bisa true/false)
      return response.data.data.isMaintenance;
    } catch (error) {
      return false;
    }
  }
};