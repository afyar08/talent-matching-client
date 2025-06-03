import { reactive } from 'vue'

export const registrationStore = reactive({
  // Registration form data
  registrationData: {
    fullName: '',
    email: '',
    password: '',
  },

  // Methods
  setRegistrationData(data) {
    this.registrationData = { ...this.registrationData, ...data }
    console.log('Registration data updated:', this.registrationData)
  },

  clearRegistrationData() {
    this.registrationData = {
      fullName: '',
      email: '',
      password: '',
    }
    console.log('Registration data cleared')
  },

  getRegistrationData() {
    return this.registrationData
  }
})