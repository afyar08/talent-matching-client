import axios from 'axios'
import apiClient from '../utils/apiClient'

export const skillService = {
  // Get all skills
  async getAllSkills() {
    try {
      const response = await apiClient.get(`skill/`, {
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