import { reactive } from 'vue';

// Create a reactive state for toast notifications
const state = reactive({
  visible: false,
  type: 'info',
  message: '',
  title: null,
  duration: 5000,
});

// Toast service methods
export const toastService = {
  // Show a toast notification
  show(options) {
    const { type = 'info', message, title = null, duration = 5000 } = options;
    
    // Update toast state
    state.type = type;
    state.message = message;
    state.title = title;
    state.duration = duration;
    state.visible = true;
    
    // Auto-hide toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.hide();
      }, duration);
    }
  },
  
  // Hide the toast notification
  hide() {
    state.visible = false;
  },
  
  // Get the current toast state
  getState() {
    return state;
  }
};
