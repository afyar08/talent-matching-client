import axios from "axios";
import apiClient from "../utils/apiClient";

export const bookmarkService = {
  // Toggle bookmark status
  async toggleBookmark(jobUrl) {
    console.log("Toggling bookmark for job URL:", jobUrl);
    try {
      const response = await apiClient.post(`job-seeker/bookmark/change-status/`, {
        job_url: jobUrl,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  },

  // Get all bookmarked jobs for user
  async getBookmarkedJobs() {
    try {
      const response = await apiClient.get(`job-seeker/bookmark/list/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting bookmarked jobs:", error);
      throw error;
    }
  },

  // Check bookmark status for multiple jobs
  async checkBookmarkStatus(jobUrls) {
    try {
      const response = await apiClient.post(`job-seeker/bookmark/check/`, {
        job_urls: jobUrls,
      },{
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking bookmark status:", error);
      throw error;
    }
  },
};
