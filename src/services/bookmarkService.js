import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const bookmarkService = {
  // Toggle bookmark status
  async toggleBookmark(userUid, jobUrl) {
    try {
      console.log("Nilai yang dikirim:", {
        user_uid: userUid, // Pastikan ini berisi nilai
        job_url: jobUrl, // Pastikan ini berisi nilai
      });
      const response = await axios.post(`${API_BASE_URL}/bookmark/`, {
        user_uid: userUid,
        job_url: jobUrl,
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  },

  // Get all bookmarked jobs for user
  async getBookmarkedJobs(userUid) {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookmark/`, {
        params: { user_uid: userUid },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting bookmarked jobs:", error);
      throw error;
    }
  },

  // Check bookmark status for multiple jobs
  async checkBookmarkStatus(userUid, jobUrls) {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookmark/status/`, {
        user_uid: userUid,
        job_urls: jobUrls,
      });
      return response.data;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      throw error;
    }
  },
};
