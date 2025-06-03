import axios from "axios";
import { getFromStorage } from "../utils/localStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const passwordService = {
  // Change user password
  async changePassword(passwordData) {
    try {
      const token = getFromStorage("user-token");
      const email = getFromStorage("user-email");

      console.log("🔄 Sending password change request...");
      console.log("API URL:", `${API_BASE_URL}/auth/change-password/`);
      console.log("Request data:", {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      console.log("Authorization token:", token);
      console.log("Token:", token ? "Present" : "Missing");

      const response = await axios.post(
        `${API_BASE_URL}/auth/change-password/`,
        {
          email: email,
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
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
