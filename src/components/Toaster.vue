<script>
export default {
  name: 'Toaster',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: value => ['success', 'error', 'info', 'warning'].includes(value)
    },
    title: {
      type: String,
      default: null
    },
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 5000 // Duration in milliseconds
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    typeClasses() {
      return {
        'border-green-500': this.type === 'success',
        'border-red-500': this.type === 'error',
        'border-blue-500': this.type === 'info',
        'border-yellow-500': this.type === 'warning'
      };
    },
    iconClasses() {
      return {
        'fa-check-circle text-green-500': this.type === 'success',
        'fa-times-circle text-red-500': this.type === 'error',
        'fa-info-circle text-blue-500': this.type === 'info',
        'fa-exclamation-circle text-yellow-500': this.type === 'warning'
      };
    },
    defaultTitle() {
      const titles = {
        success: 'Success',
        error: 'Error',
        info: 'Info',
        warning: 'Warning'
      };
      return titles[this.type];
    }
  },
  methods: {
    closeToast() {
      this.$emit('update:visible', false);
    }
  }
}
</script>

<template>
  <transition name="toast-fade">
    <div v-if="visible" 
         class="w-96 fixed top-5 right-5 z-50"
         :class="{ 'animate-slideIn': visible }">
      <div class="w-full p-5 bg-white rounded-lg shadow-md grid grid-cols-[1.3fr_6fr_0.5fr] border-l-8"
           :class="typeClasses">
        <div class="self-center">
          <i class="fas text-3xl" :class="iconClasses"></i>
        </div>
        <div class="self-center">
          <p class="text-gray-900 font-semibold text-base">{{ title || defaultTitle }}</p>
          <p class="text-xs font-normal text-gray-500">{{ message }}</p>
        </div>
        <button @click="closeToast" class="self-start bg-transparent text-2xl text-gray-500 leading-none cursor-pointer">&times;</button>
      </div>
    </div>
  </transition>
</template>

<style>
/* Font Awesome and Poppins font will need to be imported in your main app or index.html */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f3f4f6;
}

.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}
</style>