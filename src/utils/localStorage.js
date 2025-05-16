/**
 * Safely retrieve a value from localStorage
 * @param {string} key - The key to get from localStorage
 * @param {any} defaultValue - Value to return if key doesn't exist
 * @returns {string|null} The value from localStorage or defaultValue
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    return defaultValue;
  }
};

/**
 * Safely set a value in localStorage
 * @param {string} key - The key to set in localStorage
 * @param {string} value - The value to store
 * @returns {boolean} Success status
 */
export const setInStorage = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error setting localStorage:', e);
    return false;
  }
};

/**
 * Safely remove a value from localStorage
 * @param {string} key - The key to remove from localStorage
 * @returns {boolean} Success status
 */
export const removeFromStorage = (key) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    return false;
  }
};
