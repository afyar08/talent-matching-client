import axios from "axios";
import { getFromStorage } from "../utils/localStorage";

const API_BASE_URL = "http://localhost:8000/api";

export const authService = {
  // Check if email is available
  async checkEmailAvailability(email) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/check-email/`,
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { available: true, message: response.data.message };
    } catch (error) {
      if (error.response?.status === 400) {
        // Email already exists
        return {
          available: false,
          message: error.response.data.message || "Email already exists",
        };
      }
      throw error;
    }
  },

  // Register user with skills and profile picture
  async registerWithSkills(formData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/sign-up/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Regular register method (fallback)
  async register(userData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/sign-up/`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getDefaultProfile() {
    try {
      const email = localStorage.getItem("user-email");
      const response = await axios.get(`${API_BASE_URL}/profile/default/`, {
        params: { email },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile({ email, name, skills, profile_image }) {
    try {
      const formData = new FormData();
      const uid = getFromStorage("user-id");
      formData.append("uid", uid);
      formData.append("email", email);
      if (name) formData.append("name", name);
      if (skills && skills.length > 0) {
      skills.forEach(skill => formData.append("skills", skill));
    }
      if (profile_image) formData.append("profile_image", profile_image);
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.patch(
        `${API_BASE_URL}/profile/edit/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
