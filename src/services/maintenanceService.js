import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const maintenanceService = {
  async getMaintenanceStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/maintenance/status/`);
      // Kembalikan sesuai responsenya (bisa true/false)
      return response.data.is_maintenance;
    } catch (error) {
      return false;
    }
  }
};