<template>
  <div class="login-page">
    <div class="left-panel">
      <img :src="logoWhite" alt="Bullion Ecosystem Logo" class="logo-image">
    </div>
    <div class="right-panel">
      <div class="form-container">
        <h1>Login Admin</h1>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              placeholder="Masukkan email"
              :class="{ 'error': errors.email }"
            >
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-with-icon">
              <input 
                :type="passwordFieldType" 
                id="password" 
                v-model="formData.password" 
                placeholder="Masukkan password"
                :class="{ 'error': errors.password }"
              >
              <span class="icon icon--clickable" @click="togglePasswordVisibility">
                <!-- Icon mata terbuka (password tersembunyi) -->
                    <svg v-if="!isPasswordVisible" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <!-- Icon mata tertutup dengan garis (password terlihat) -->
                    <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/>
                        <path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M3 3L21 21" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
              </span>
            </div>
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>
          
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>
        
        <!-- Link to register page -->
        <div class="auth-link">
          <p>Belum punya akun? <router-link to="/register">Daftar disini</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockAuthService as authService } from '@/services/mockApiService';
import CryptoJS from 'crypto-js';

// Import gambar
import logoWhite from '@/assets/logo-white.png';
import backgroundGraphic from '@/assets/logo.png';

const router = useRouter();
const backgroundImageUrl = `url(${backgroundGraphic})`;

const formData = reactive({
  email: '',
  password: ''
});

const errors = ref({});
const isLoading = ref(false);

// Logika toggle password visibility (tidak ada perubahan)
const isPasswordVisible = ref(false);
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');
const togglePasswordVisibility = () => { 
  isPasswordVisible.value = !isPasswordVisible.value; 
};

// Validasi form (tidak ada perubahan)
const validateForm = () => {
  errors.value = {};
  if (!formData.email) {
    errors.value.email = 'Email wajib diisi.';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.value.email = 'Format email tidak valid.';
  }
  if (!formData.password) {
    errors.value.password = 'Password wajib diisi.';
  }
  return Object.keys(errors.value).length === 0;
};

// PERBAIKAN UTAMA DI SINI
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  
  // 2. Enkripsi password sebelum dikirim
  const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);

  // 3. Buat payload yang akan dikirim
  const payload = {
    email: formData.email,
    password: hashedPassword // Kirim password yang sudah di-hash
  };

  console.log("Password asli:", formData.password);
  console.log("Password di-hash:", hashedPassword);
  
  try {
    const response = await authService.login(payload); // Kirim payload, bukan formData
    
    // Simpan token ke localStorage
    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem('authToken', response.data.data.token);
      alert('Login berhasil!');
      router.push('/dashboard');
    } else {
      // Tangani jika respons sukses tapi tidak ada token
      throw new Error('Respons tidak valid dari server.');
    }
    
  } catch (error) {
    console.error('Error saat login:', error);
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      alert('Gagal terhubung ke server. Periksa koneksi internet Anda.');
      return;
    }

    const status = error.response.status;
    const data = error.response.data;
    let errorMessage = `Terjadi kesalahan (Status: ${status}). Silakan coba lagi.`;

    // Tangani error spesifik dari backend (misal: "email / password salah")
    if (data && data.err_message) {
        errorMessage = data.err_message;
    } else if (status === 401) {
        errorMessage = 'Email atau password salah.';
    }

    alert(errorMessage);

  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body, html {
  font-family: 'Montserrat', sans-serif;
  background-color: #FFF;
}

.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #FFFFFF;
  width: 100%;
}
  
.left-panel {
  width: 548px;
  min-width: 548px;
  background: #FD5725; /* Warna solid oranye */
  padding: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.left-panel::before {
  content: '';
  position: absolute;
  top: -62px;
  left: -214px;
  width: 605px;
  height: 552px;
  background-image: v-bind(backgroundImageUrl);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 25%;
}

.logo-image {
  width: 104px;
  height: 32px;
  z-index: 1;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Jaga agar form mulai dari atas */
  padding: 0 20px;
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 405px; /* Lebar sesuai Figma */
  display: flex;
  flex-direction: column;
  gap: 24px; /* Jarak antar form-group sesuai Figma */
  padding: 80px 0; /* Padding atas 80px, bawah 0 */
}

h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 32px; /* Ukuran sesuai Figma */
  font-weight: 700;
  color: #000000;
  text-align: left;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Jarak antara label dan input */
  padding-top: 16px;
}

label {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  padding-bottom: 0;
}

.input-with-icon {
  position: relative;
}

input[type="email"],
input[type="password"],
input[type="text"] {
  display: block;
  width: 100%;
  height: 46px;
  padding: 8px 16px; /* Padding sesuai Figma */
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif; /* Font placeholder sesuai Figma */
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
  font-weight: 400;
}

/* Penyesuaian padding untuk input dengan ikon */
.input-with-icon input {
  padding-right: 45px; /* Beri ruang untuk ikon di kanan */
}

input::placeholder {
  color: #98A2B3; /* Sesuaikan jika perlu */
  font-family: 'Montserrat', sans-serif;
}

input:focus {
  border-color: #FF6B35;
  box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
}

input.error {
  border-color: #E53935;
}

/* Ensure password field maintains consistent styling */
#password {
  font-family: 'Inter', sans-serif !important;
  letter-spacing: normal !important;
}

/* Override browser default password styling */
#password::-ms-reveal,
#password::-ms-clear {
  display: none;
}

.icon {
  position: absolute;
  top: 0;
  right: -2px;
  height: 100%;
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.icon--clickable {
  cursor: pointer;
  pointer-events: auto;
}

button[type="submit"] {
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FD5725; /* Warna solid oranye */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 16px; /* Hapus, diatur oleh gap */
}

button[type="submit"]:hover {
  opacity: 0.9;
}

button[type="submit"]:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.error-text {
  color: #E53935;
  font-size: 12px;
  margin-top: 4px;
}

.auth-link {
  text-align: center;
  margin-top: 0; /* Diatur oleh gap dari .form-container */
}

.auth-link p {
  font-size: 14px;
  color: #666;
}

.auth-link a {
  color: #FF6B35;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}

/* Responsive breakpoints */
@media (max-width: 1200px) {
  .left-panel {
    width: 35%;
    min-width: 280px;
    padding: 40px 30px;
  }
  
  .form-container {
    max-width: 380px;
  }
  
  h1 {
    font-size: 32px;
  }
}

@media (max-width: 992px) {
  .login-page {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    height: 200px;
    min-width: unset;
    padding: 30px 20px;
    justify-content: center;
    align-items: center;
    order: -1; /* This moves the left panel to the top */
  }
  
  .left-panel::before {
    top: -30px;
    left: -100px;
    width: 300px;
    height: 270px;
    opacity: 15%;
  }
  
  .logo-image {
    width: 90px;
    height: 28px;
  }
  
  .right-panel {
    min-height: calc(100vh - 200px);
    padding: 30px 20px;
  }
  
  .form-container {
    max-width: 100%;
    gap: 24px;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) {
  .left-panel {
    height: 150px;
    padding: 20px;
  }
  
  .logo-image {
    width: 80px;
    height: 25px;
  }
  
  .right-panel {
    padding: 20px 15px;
    min-height: calc(100vh - 150px);
  }
  
  .form-group {
    gap: 6px;
  }
  
  label {
    font-size: 13px;
    padding-bottom: 4px;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    height: 44px;
    font-size: 13px;
    padding: 8px 40px 8px 12px;
  }
  
  input::placeholder {
    font-size: 13px;
  }
  
  .icon {
    width: 40px;
  }
  
  h1 {
    font-size: 24px;
  }
  
  button[type="submit"] {
    height: 44px;
    font-size: 15px;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .left-panel {
    height: 120px;
    padding: 15px;
  }
  
  .logo-image {
    width: 70px;
    height: 22px;
  }
  
  .right-panel {
    padding: 15px 10px;
    min-height: calc(100vh - 120px);
  }
  
  .form-container {
    gap: 20px;
  }
  
  h1 {
    font-size: 22px;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    height: 42px;
    font-size: 12px;
    padding: 8px 35px 8px 10px;
  }
  
  input::placeholder {
    font-size: 12px;
  }
  
  .icon {
    width: 35px;
  }
  
  .icon svg {
    width: 20px;
    height: 20px;
  }
  
  label {
    font-size: 12px;
  }
  
  button[type="submit"] {
    height: 42px;
    font-size: 14px;
    margin-top: 10px;
  }
  
  .error-text {
    font-size: 11px;
  }
  
  .auth-link p {
    font-size: 13px;
  }
}

/* Landscape mode for mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .login-page {
    flex-direction: row;
  }
  
  .left-panel {
    width: 30%;
    height: 100vh;
    min-width: 200px;
    order: 0; /* Reset order for landscape */
  }
  
  .right-panel {
    min-height: 100vh;
    width: 70%;
  }
}

/* Very small screens */
@media (max-width: 320px) {
  .right-panel {
    padding: 10px 5px;
  }
  
  .form-container {
    gap: 16px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  input[type="email"],
  input[type="password"],
  input[type="text"] {
    height: 40px;
    font-size: 11px;
    padding: 6px 30px 6px 8px;
  }
  
  input::placeholder {
    font-size: 11px;
  }
  
  button[type="submit"] {
    height: 40px;
    font-size: 13px;
  }
}
</style>