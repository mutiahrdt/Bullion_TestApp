<template>
  <div class="user-form">
    <h1>Daftar</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <div class="form-row">
        <div class="form-group">
          <BaseInput
            id="firstName"
            label="Nama Depan"
            v-model="formData.first_name"
            placeholder="Masukkan nama depan"
            :error="errors.first_name"
          />
        </div>

        <div class="form-group">
          <BaseInput
            id="lastName"
            label="Nama Belakang"
            v-model="formData.last_name"
            placeholder="Masukkan nama belakang"
            :error="errors.last_name"
          />
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
              <svg width="16" height="10" viewBox="0 2 16 10" fill="#FD5725" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L8 8.5L15 1.5" stroke="#FD5725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <span v-if="errors.gender" class="error-text">{{ errors.gender }}</span>
        </div>

        <div class="form-group">
          <BaseInput
            id="dob"
            label="Tanggal Lahir"
            v-model="formData.date_of_birth"
            :inputType="dateInputType"
            placeholder="Masukkan tanggal lahir"
            :error="errors.date_of_birth"
            icon="calendar"
            @focus="switchToDate"
            @blur="switchToText"
          />
        </div>
      </div>

      <BaseInput
        id="email"
        label="Email"
        inputType="email"
        v-model="formData.email"
        placeholder="Masukkan email"
        :error="errors.email"
      />

      <BaseInput
        id="phone"
        label="No. Handphone"
        inputType="tel"
        v-model="formData.phone"
        placeholder="Masukkan no handphone"
        :error="errors.phone"
      />

      <BaseInput
        id="address"
        label="Alamat"
        inputType="text"
        v-model="formData.address"
        placeholder="Masukkan alamat"
        :error="errors.address"
      />

      <div class="form-row">
        <div class="form-group">
          <BaseInput
            id="password"
            label="Password"
            :inputType="passwordFieldType"
            v-model="formData.password"
            placeholder="Masukkan password"
            :error="errors.password"
            icon="eye"
            @icon-click="togglePasswordVisibility"
          />
        </div>

        <div class="form-group">
          <BaseInput
            id="confirmPassword"
            label="Konfirmasi Password"
            :inputType="confirmPasswordFieldType"
            v-model="formData.password_confirmation"
            placeholder="Konfirmasi password"
            :error="errors.password_confirmation"
            icon="eye"
            @icon-click="toggleConfirmPasswordVisibility"
          />
        </div>
      </div>

      <BaseInput
        id="profilePicture"
        label="Foto Profil"
        inputType="file"
        v-model="formData.photo"
        accept="image/jpeg, image/jpg"
        :error="errors.photo"
        icon="upload"
        @file-change="handleFileChange"
      />

      <BaseButton type="submit" :disabled="isLoading">
        {{ isLoading ? 'Memproses...' : 'Tambah' }}
      </BaseButton>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import { mockAuthService as authService } from '@/services/mockApiService';

const router = useRouter();

const formData = reactive({
  first_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
  photo: null,
});

const errors = ref({});
const isLoading = ref(false);

const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const passwordFieldType = computed(() => (isPasswordVisible.value ? 'text' : 'password'));
const confirmPasswordFieldType = computed(() => (isConfirmPasswordVisible.value ? 'text' : 'password'));
const togglePasswordVisibility = () => { isPasswordVisible.value = !isPasswordVisible.value; };
const toggleConfirmPasswordVisibility = () => { isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value; };

const dateInputType = ref('text');
const switchToDate = () => { dateInputType.value = 'date'; };
const switchToText = () => {
  if (!formData.date_of_birth) dateInputType.value = 'text';
};

const handleFileChange = (file) => {
  if (!file) { formData.photo = null; return; }
  errors.value.photo = null;
  if (file.size > 5 * 1024 * 1024) {
    errors.value.photo = 'Ukuran file maksimal adalah 5MB.';
    formData.photo = null;
    return;
  }
  if (!['image/jpeg', 'image/jpg'].includes(file.type)) {
    errors.value.photo = 'Format file harus JPG atau JPEG.';
    formData.photo = null;
    return;
  }
  formData.photo = file;
};

const validateForm = () => {
  errors.value = {};
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
    photo: 'Foto Profil',
  };
  for (const field in fieldLabels) {
    if (!formData[field]) errors.value[field] = `${fieldLabels[field]} wajib diisi.`;
  }
  if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) errors.value.email = 'Format email tidak valid.';
  if (formData.password) {
    if (formData.password.length < 8) errors.value.password = 'Password minimal 8 karakter.';
    else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) errors.value.password = 'Password harus mengandung huruf dan angka.';
    else if (!/[A-Z]/.test(formData.password)) errors.value.password = 'Password harus mengandung minimal 1 huruf kapital.';
  }
  if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation) {
    errors.value.password_confirmation = 'Konfirmasi password tidak cocok.';
  }
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  const submissionData = new FormData();
  const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);
  const genderValue = formData.gender === 'L' ? 'male' : 'female';
  const dobValue = new Date(formData.date_of_birth).toISOString();

  submissionData.append('first_name', formData.first_name);
  submissionData.append('last_name', formData.last_name);
  submissionData.append('gender', genderValue);
  submissionData.append('date_of_birth', dobValue);
  submissionData.append('email', formData.email);
  submissionData.append('phone', formData.phone);
  submissionData.append('address', formData.address);
  submissionData.append('password', hashedPassword);
  if (formData.photo) submissionData.append('photo', formData.photo);

  try {
    await authService.register(submissionData);
    alert('Registrasi berhasil! Anda akan diarahkan ke halaman login.');
    router.push('/login');
  } catch (error) {
    console.error('Error saat registrasi:', error);
    if (error.code === 'ERR_NETWORK' || !error.response) {
      alert('Gagal terhubung ke server. Periksa koneksi internet atau hubungi administrator.');
    } else {
      const status = error.response?.status;
      const data = error.response?.data;
      let errorMessage = `Terjadi kesalahan (Status: ${status}). Silakan coba lagi.`;
      if (status === 400 && data?.err_message) errorMessage = data.err_message;
      else if (status === 422 && data && data.errors) {
        const serverErrors = Object.values(data.errors).flat();
        errorMessage = `Registrasi gagal:\n- ${serverErrors.join('\n- ')}`;
      } else if (data && data.message) errorMessage = data.message;
      alert(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.user-form { width:100%; max-width:425px; display:flex; flex-direction:column; gap:32px; padding:40px 0; }
h1{ font-family:'Montserrat',sans-serif; font-size:36px; font-weight:700; color:#000; text-align:left; }
.form-row{ display:flex; gap:16px; }
.form-row .form-group{ flex:1; }
.form-group{ display:flex; flex-direction:column; gap:8px; padding-bottom:16px; }
label{ font-family:'Montserrat',sans-serif; font-size:14px; font-weight:700; color:#000; }
select{ display:block; width:100%; height:46px; padding:8px 16px; border:1px solid #E0E0E0; border-radius:8px; font-size:14px; font-family:'Inter',sans-serif; outline:none; background:#fff; -webkit-appearance:none; -moz-appearance:none; appearance:none; cursor:pointer; }
.icon{ position:absolute; top:0; right:-2px; height:100%; width:45px; display:flex; align-items:center; justify-content:center; pointer-events:none; }
.error-text{ color:#E53935; font-size:12px; margin-top:4px; }
button[type="submit"]{ width:100%; height:46px; display:flex; align-items:center; justify-content:center; background-color:#2E74B2; color:white; border:none; border-radius:8px; font-size:16px; font-family:'Inter',sans-serif; font-weight:500; cursor:pointer; transition:background-color .2s; margin-top:15px; }
button[type="submit"]:hover:enabled{ background-color:#255d8f; }
button[type="submit"]:disabled{ background-color:#ccc; cursor:not-allowed; }
@media (max-width: 768px) {
  .form-row{ flex-direction:column; gap:0; }
}
</style>
