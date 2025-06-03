import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

export const skillService = {
  // Get all skills
  async getAllSkills() {
    try {
      const response = await axios.get(`${API_BASE_URL}/skills/`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}