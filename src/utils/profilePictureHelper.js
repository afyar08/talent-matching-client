import { getFromStorage, setInStorage } from './localStorage';

/**
 * Get user profile picture from localStorage or return default
 * @returns {string|null} Profile picture URL or null for default
 */
export const getUserProfilePicture = () => {
  const storedProfilePicture = getFromStorage('user-profile-picture');
  if (storedProfilePicture) {
    // If it's a relative URL, make it absolute
    if (storedProfilePicture.startsWith('/api/')) {
      return `${window.location.origin}${storedProfilePicture}`;
    }
    return storedProfilePicture;
  }
  return null;
};

/**
 * Set user profile picture in localStorage
 * @param {string} profilePictureUrl - The URL or path of the profile picture
 */
export const setUserProfilePicture = (profilePictureUrl) => {
  setInStorage('user-profile-picture', profilePictureUrl);
};

/**
 * Clear user profile picture from localStorage
 */
export const clearUserProfilePicture = () => {
  removeFromStorage('user-profile-picture');
};

/**
 * Get profile picture with authentication token for API calls
 * @returns {Promise<string|null>} Profile picture blob URL or null
 */
export const fetchUserProfilePicture = async () => {
  const token = getFromStorage('user-token');
  const profilePictureUrl = getFromStorage('user-profile-picture');
  
  if (!token || !profilePictureUrl) return null;
  
  try {
    const response = await fetch(profilePictureUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return null;
  }
};