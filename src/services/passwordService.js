import axios from "axios";
import { getFromStorage } from "../utils/localStorage";
import apiClient from "../utils/apiClient";


export const passwordService = {
  // Change user password
  async changePassword(passwordData) {
    try {
      const token = getFromStorage("user-token");
      const response = await apiClient.post(
        `job-seeker/profile/change-password/`,
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Password change response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Password change error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  },
};
