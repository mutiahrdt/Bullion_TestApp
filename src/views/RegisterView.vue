<template>
  <div class="register-page">
    <div class="left-panel">
      <img :src="logoWhite" alt="Bullion Ecosystem Logo" class="logo-image">
    </div>
    <div class="right-panel">
      <div class="form-container">
        <h1>Daftar</h1>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nama Depan</label>
              <input type="text" id="firstName" v-model="formData.first_name" placeholder="Masukkan nama depan">
              <span v-if="errors.first_name" class="error-text">{{ errors.first_name }}</span>
            </div>
            <div class="form-group">
              <label for="lastName">Nama Belakang</label>
              <input type="text" id="lastName" v-model="formData.last_name" placeholder="Masukkan nama belakang">
              <span v-if="errors.last_name" class="error-text">{{ errors.last_name }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="gender">Jenis Kelamin</label>
              <div class="select-wrapper">
                <select id="gender" v-model="formData.gender">
                  <option disabled value="">Pilih jenis kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <span class="icon">
                  <svg width="16" height="10" viewBox="0 2 16 10" fill="#FD5725" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L8 8.5L15 1.5" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <span v-if="errors.gender" class="error-text">{{ errors.gender }}</span>
            </div>
            <div class="form-group">
              <label for="dob">Tanggal Lahir</label>
              <div class="input-with-icon">
                <!-- MENGGUNAKAN NAMA FIELD YANG BENAR: date_of_birth -->
                <input type="text" id="dob" v-model="formData.date_of_birth" placeholder="Masukkan tanggal lahir" onfocus="(this.type='date')" onblur="(this.type='text')">
                <span class="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 2V5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3.5 9.08984H20.5" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="#FD5725" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.6947 13.7002H15.7037" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.6947 16.7002H15.7037" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.9955 13.7002H12.0045" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M11.9955 16.7002H12.0045" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.29431 13.7002H8.30331" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.29431 16.7002H8.30331" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
              <span v-if="errors.date_of_birth" class="error-text">{{ errors.date_of_birth }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="formData.email" placeholder="Masukkan email">
            <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="phone">No. Handphone</label>
            <input type="tel" id="phone" v-model="formData.phone" placeholder="Masukkan no handphone">
            <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
          </div>
          
          <div class="form-group">
            <label for="address">Alamat</label>
            <input type="text" id="address" v-model="formData.address" placeholder="Masukkan alamat">
            <span v-if="errors.address" class="error-text">{{ errors.address }}</span>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-with-icon">
                <input :type="passwordFieldType" id="password" v-model="formData.password" placeholder="Masukkan password">
                <span class="icon icon--clickable" @click="togglePasswordVisibility">
                  <svg v-if="!isPasswordVisible" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/><path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/><path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3L21 21" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password</label>
              <div class="input-with-icon">
                <input :type="confirmPasswordFieldType" id="confirmPassword" v-model="formData.password_confirmation" placeholder="Konfirmasi password">
                <span class="icon icon--clickable" @click="toggleConfirmPasswordVisibility">
                  <svg v-if="!isConfirmPasswordVisible" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/><path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="11.5" r="2.5" stroke="#FD5725" stroke-width="1.5"/><path d="M20.18 11.5C19.34 8.75 16.92 6.75 12 6.75C7.08 6.75 4.66 8.75 3.82 11.5C4.66 14.25 7.08 16.25 12 16.25C16.92 16.25 19.34 14.25 20.18 11.5Z" stroke="#FD5725" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 3L21 21" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
              <span v-if="errors.password_confirmation" class="error-text">{{ errors.password_confirmation }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="profilePicture">Foto Profil</label>
            <div class="custom-file-input">
              <label for="profilePicture" class="file-label">
                <!-- MENAMPILKAN NAMA FILE DARI formData.photo -->
                <span>{{ formData.photo ? formData.photo.name : 'Pilih foto profil'}}</span>
                <span class="icon">
                  <svg width="22" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.44 22.08 10.4 19.68 10.13" fill="#ffffff" fill-opacity="0.1" stroke="#FD5725" stroke-width="2"/>
                    <path d="M14.4 11.4L12 9L9.6 11.4M12 9V16" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </label>
              <input type="file" id="profilePicture" @change="onFileChange" accept="image/jpeg, image/jpg" style="display: none;">
            </div>
            <span v-if="errors.photo" class="error-text">{{ errors.photo }}</span>
          </div>
          
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Memproses...' : 'Tambah' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mockAuthService as authService } from '@/services/mockApiService';
import CryptoJS from 'crypto-js';

// Import aset gambar
import logoWhite from '@/assets/logo-white.png';
import backgroundGraphic from '@/assets/logo.png';

const router = useRouter();
const backgroundImageUrl = `url(${backgroundGraphic})`;

// State untuk data form
const formData = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '', // Disesuaikan dengan nama field backend
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
  photo: null, // Disesuaikan dengan nama field backend
});

// State untuk error dan status loading
const errors = ref({});
const isLoading = ref(false);

// State dan logika untuk toggle visibilitas password
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');
const confirmPasswordFieldType = computed(() => isConfirmPasswordVisible.value ? 'text' : 'password');
const togglePasswordVisibility = () => { isPasswordVisible.value = !isPasswordVisible.value; };
const toggleConfirmPasswordVisibility = () => { isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value; };

// Fungsi untuk menangani upload file
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) {
    formData.photo = null;
    return;
  }
  
  errors.value.photo = null; // Reset error spesifik

  // Validasi ukuran dan format file di sisi klien
  if (file.size > 5 * 1024 * 1024) { // Max 5MB
    errors.value.photo = 'Ukuran file maksimal adalah 5MB.';
    e.target.value = '';
    formData.photo = null;
    return;
  }
  if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
    errors.value.photo = 'Format file harus JPG atau JPEG.';
    e.target.value = '';
    formData.photo = null;
    return;
  }
  
  formData.photo = file;
};

// Fungsi untuk validasi form sebelum submit
const validateForm = () => {
  errors.value = {}; // Reset error setiap kali validasi

  const fieldLabels = {
    first_name: 'Nama Depan',
    last_name: 'Nama Belakang',
    gender: 'Jenis Kelamin',
    date_of_birth: 'Tanggal Lahir',
    email: 'Email',
    phone: 'No. Handphone',
    address: 'Alamat',
    password: 'Password',
    password_confirmation: 'Konfirmasi Password',
    photo: 'Foto Profil'
  };

  for (const field in fieldLabels) {
    if (!formData[field]) {
      errors.value[field] = `${fieldLabels[field]} wajib diisi.`;
    }
  }

  // Validasi format email
  if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.value.email = 'Format email tidak valid.';
  }

  // Validasi kriteria password
  if (formData.password) {
    if (formData.password.length < 8) {
      errors.value.password = 'Password minimal 8 karakter.';
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      errors.value.password = 'Password harus mengandung huruf dan angka.';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.value.password = 'Password harus mengandung minimal 1 huruf kapital.';
    }
  }

  // Validasi konfirmasi password
  if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation) {
    errors.value.password_confirmation = 'Konfirmasi password tidak cocok.';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Fungsi utama yang dijalankan saat form di-submit
const handleSubmit = async () => {
  // 1. Jalankan validasi klien
  if (!validateForm()) {
    return;
  }
  
  isLoading.value = true;
  
  // 2. Siapkan FormData untuk dikirim
  const submissionData = new FormData();
  
  // 3. Enkripsi password ke SHA-256
  const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);

  // 4. Siapkan data dengan format yang benar
  const genderValue = formData.gender === 'L' ? 'male' : 'female';
  const dobValue = new Date(formData.date_of_birth).toISOString();

  // 5. Masukkan semua data ke FormData
  submissionData.append('first_name', formData.first_name);
  submissionData.append('last_name', formData.last_name);
  submissionData.append('gender', genderValue);
  submissionData.append('date_of_birth', dobValue);
  submissionData.append('email', formData.email);
  submissionData.append('phone', formData.phone);
  submissionData.append('address', formData.address);
  submissionData.append('password', hashedPassword); // Kirim password yang sudah di-hash
  
  if (formData.photo) {
    submissionData.append('photo', formData.photo);
  }

  try {
    // 6. Kirim data ke API
    await authService.register(submissionData);
    alert('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
    router.push('/login');

  } catch (error) {
    // 7. Tangani berbagai jenis error
    console.error('Error saat registrasi:', error);
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      alert('Gagal terhubung ke server. Periksa koneksi internet atau hubungi administrator.');
    } else {
      const status = error.response.status;
      const data = error.response.data;
      let errorMessage = `Terjadi kesalahan (Status: ${status}). Silakan coba lagi.`;

      if (status === 400 && data.err_message) { // Contoh: "email sudah terdaftar"
        errorMessage = data.err_message;
      } else if (status === 422 && data && data.errors) { // Error validasi dari server
        const serverErrors = Object.values(data.errors).flat();
        errorMessage = `Registrasi gagal:\n- ${serverErrors.join('\n- ')}`;
      } else if (data && data.message) { // Error umum lain dengan pesan
        errorMessage = data.message;
      }
      
      alert(errorMessage);
    }
  } finally {
    // 8. Selalu hentikan status loading
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

.register-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #FFFFFF;
  width: 100%;
}

.left-panel {
  width: 548px; /* Sesuai Figma */
  min-width: 548px; /* Kunci lebarnya */
  background: #2E74B2; /* Warna solid biru sesuai Figma */
  padding: 60px; /* Sederhanakan padding */
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
  align-items: flex-start;
  padding: 0 20px; /* Hapus padding atas & bawah (40px) */
  overflow-y: auto;
}

.form-container {
  width: 100%;
  max-width: 425px; /* Sesuai Figma */
  display: flex;
  flex-direction: column;
  gap: 32px; /* Sesuai Figma */
  padding: 40px 0;
}

h1 {
  font-family: 'Montserrat', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #000000;
  text-align: left;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Jarak antara label dan input */
  padding-bottom: 16px;
}

label {
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #000000;
  padding-top: 0; /* Hapus padding yang tidak perlu */
  padding-bottom: 0;
}

.select-wrapper,
.input-with-icon,
.custom-file-input {
  position: relative;
}

input[type="text"],
input[type="email"],
input[type="tel"],
input[type="password"],
input[type="date"],
select,
.file-label {
  display: block;
  width: 100%;
  height: 46px;
  padding: 8px 16px; /* Padding sesuai Figma */
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif; /* Placeholder menggunakan Inter */
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: white;
  font-weight: 400; /* Font weight untuk input text */
}

input::placeholder {
    color: #98A2B3; /* Sesuaikan warna jika perlu */
}

/* Hide the default calendar icon for date inputs */
input[type="date"]::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}

input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.file-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #98A2B3;
  cursor: pointer;
  padding-right: 13px;
}

input::placeholder, select:required:invalid {
  color: #98A2B3;
}

input:focus,
select:focus {
  border-color: #2F66B2;
  box-shadow: 0 0 0 2px rgba(47, 102, 178, 0.2);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
}

.custom-file-input input[type="file"] {
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
  background-color: #2E74B2; /* Warna solid biru */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 15px; /* Margin diatur oleh gap dari form-container */
}

button[type="submit"]:hover {
  background-color: #255d8f; /* Warna hover yang lebih gelap */
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-text {
  color: #E53935;
  font-size: 12px;
  margin-top: 4px;
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
  .register-page {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    height: 30vh;
    min-width: unset;
    min-height: 180px;
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
    gap: 20px;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
}

@media (max-width: 768px) and (orientation: landscape) {
  .register-page {
    flex-direction: row;
  }
  
  .left-panel {
    width: 30%;
    min-width: 200px;
    order: 0;
  }
  
  .right-panel {
    width: 70%;
  }
  
  .logo-image {
    width: 80px;
    height: 25px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group {
    gap: 6px;
  }
  
  label {
    font-size: 13px;
    padding-top: 12px;
    padding-bottom: 4px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="date"],
  select,
  .file-label {
    height: 44px;
    font-size: 13px;
    padding: 8px 35px 8px 12px;
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
    margin-top: 24px;
  }
}

@media (max-width: 480px) {
  .left-panel {
    height: 20vh;
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
    gap: 16px;
  }
  
  h1 {
    font-size: 22px;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="date"],
  select,
  .file-label {
    height: 42px;
    font-size: 12px;
    padding: 8px 32px 8px 10px;
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
    padding-top: 10px;
  }
  
  button[type="submit"] {
    height: 42px;
    font-size: 14px;
    margin-top: 20px;
  }
  
  .error-text {
    font-size: 11px;
  }
}

/* Landscape mode for mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .register-page {
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
    gap: 12px;
  }
  
  h1 {
    font-size: 20px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="tel"],
  input[type="password"],
  input[type="date"],
  select,
  .file-label {
    height: 40px;
    font-size: 11px;
    padding: 6px 30px 6px 8px;
  }
  
  button[type="submit"] {
    height: 40px;
    font-size: 13px;
  }
}</style>