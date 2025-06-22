import axios from 'axios';
import apiClient from '../utils/apiClient';

const API_BASE_URL = 'http://localhost:8000/api';

export const maintenanceService = {
  async getMaintenanceStatus() {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/maintenance/status/`);
      // Kembalikan sesuai responsenya (bisa true/false)
      return response.data.is_maintenance;
    } catch (error) {
      return false;
    }
  }
};