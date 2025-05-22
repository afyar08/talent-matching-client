<script setup>
import { toastService } from './utils/toastService';
import Toaster from './components/Toaster.vue';
// No need to import specific pages anymore
</script>

<template>
  <div>
    <!-- Global Toaster component connected to the toast service -->
    <Toaster 
      :type="toastService.getState().type"
      :message="toastService.getState().message"
      :title="toastService.getState().title"
      :visible="toastService.getState().visible"
      :duration="toastService.getState().duration"
      @update:visible="(value) => toastService.getState().visible = value"
    />
    
    <!-- Router view for page content -->
    <router-view />
  </div>
</template>
