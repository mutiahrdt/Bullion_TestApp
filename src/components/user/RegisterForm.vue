<template>
  <form @submit.prevent="handleSubmit" class="register-form">
    <!-- Baris untuk Nama Depan & Belakang -->
    <div class="form-row">
      <div class="form-group"><BaseInput id="firstName" v-model="formData.first_name" label="Nama Depan" placeholder="Masukkan nama depan" :error="errors.first_name" /></div>
      <div class="form-group"><BaseInput id="lastName" v-model="formData.last_name" label="Nama Belakang" placeholder="Masukkan nama belakang" :error="errors.last_name" /></div>
    </div>

    <!-- Baris untuk Jenis Kelamin & Tanggal Lahir -->
    <div class="form-row">
      <div class="form-group"><BaseSelect id="gender" v-model="formData.gender" label="Jenis Kelamin" placeholder="Pilih jenis kelamin" :options="genderOptions" :error="errors.gender"><template #icon><IconChevronDown /></template></BaseSelect></div>
      <div class="form-group"><BaseInput id="dob" v-model="formData.date_of_birth" type="date" label="Tanggal Lahir" placeholder="Masukkan tanggal lahir" :error="errors.date_of_birth"><template #icon><IconCalendar /></template></BaseInput></div>
    </div>

    <!-- Input standar untuk Email, No. Handphone, dan Alamat -->
    <div class="form-group"><BaseInput id="email" v-model="formData.email" type="email" label="Email" placeholder="Masukkan email" :error="errors.email" /></div>
    <div class="form-group"><BaseInput id="phone" v-model="formData.phone" type="tel" label="No. Handphone" placeholder="Masukkan no handphone" :error="errors.phone" /></div>
    <div class="form-group"><BaseInput id="address" v-model="formData.address" label="Alamat" placeholder="Masukkan alamat" :error="errors.address" /></div>

    <!-- Baris untuk Password & Konfirmasi Password -->
    <div class="form-row">
      <div class="form-group"><BaseInput id="password" v-model="formData.password" :type="isPasswordVisible ? 'text' : 'password'" label="Password" placeholder="Masukkan password" :error="errors.password"><template #icon><button type="button" @click="togglePasswordVisibility" class="icon-button"><IconEye v-if="!isPasswordVisible" /><IconEyeSlash v-else /></button></template></BaseInput></div>
      <div class="form-group"><BaseInput id="confirmPassword" v-model="formData.password_confirmation" :type="isConfirmPasswordVisible ? 'text' : 'password'" label="Konfirmasi Password" placeholder="Konfirmasi password" :error="errors.password_confirmation"><template #icon><button type="button" @click="toggleConfirmPasswordVisibility" class="icon-button"><IconEye v-if="!isConfirmPasswordVisible" /><IconEyeSlash v-else /></button></template></BaseInput></div>
    </div>

    <!-- Input untuk unggah foto profil -->
    <div class="form-group"><BaseFileUpload id="profilePicture" v-model="formData.photo" label="Foto Profil" accept="image/jpeg,image/jpg" :max-size="5 * 1024 * 1024" :error="errors.photo" @error="handleFileError" /></div>

    <!-- Tombol submit form -->
    <BaseButton type="submit" variant="primary" :loading="isLoading" :disabled="isLoading" class="submit-button">{{ isLoading ? 'Memproses...' : 'Tambah' }}</BaseButton>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import { authService } from '@/services/apiService';

// Impor komponen UI dan Ikon
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseSelect from '@/components/ui/BaseSelect.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import BaseFileUpload from '@/components/ui/BaseFileUpload.vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue';

const router = useRouter();

// State management (tidak ada perubahan)
const formData = reactive({ first_name: '', last_name: '', gender: '', date_of_birth: '', email: '', phone: '', address: '', password: '', password_confirmation: '', photo: null });
const errors = ref({});
const isLoading = ref(false);
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const togglePasswordVisibility = () => { isPasswordVisible.value = !isPasswordVisible.value; };
const toggleConfirmPasswordVisibility = () => { isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value; };
const genderOptions = [ { value: 'L', label: 'Laki-laki' }, { value: 'P', label: 'Perempuan' } ];
const handleFileError = (error) => { errors.value.photo = error; };

// =======================================================
// PERUBAHAN UTAMA ADA DI FUNGSI VALIDASI INI
// =======================================================
const validateForm = () => {
  errors.value = {};
  const fieldLabels = {
    first_name: 'Nama Depan', last_name: 'Nama Belakang', gender: 'Jenis Kelamin',
    date_of_birth: 'Tanggal Lahir', email: 'Email', phone: 'No. Handphone',
    address: 'Alamat', password: 'Password', password_confirmation: 'Konfirmasi Password',
    photo: 'Foto Profil'
  };

  // Validasi field yang wajib diisi (Required)
  for (const field in fieldLabels) {
    if (!formData[field]) {
      errors.value[field] = `${fieldLabels[field]} wajib diisi.`;
    }
  }

  // Validasi Email (tidak berubah)
  if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.value.email = 'Format email tidak valid.';
  }

  // Validasi Password dengan aturan baru
  if (formData.password) {
    if (formData.password.length < 8) {
      errors.value.password = 'Password minimal 8 karakter.';
    } else if (!/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      // Cek apakah mengandung huruf DAN angka
      errors.value.password = 'Password harus mengandung kombinasi huruf dan angka.';
    } else if (!/[A-Z]/.test(formData.password)) {
      // Cek apakah mengandung minimal 1 huruf kapital
      errors.value.password = 'Password harus mengandung minimal 1 huruf kapital.';
    }
  }

  // Validasi Konfirmasi Password (tidak berubah)
  if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation) {
    errors.value.password_confirmation = 'Konfirmasi password tidak cocok.';
  }

  // Perlu diperhatikan: Validasi ukuran dan format file foto sudah ditangani oleh
  // komponen BaseFileUpload melalui props `max-size` dan `accept`.
  // Baris di atas hanya memastikan bahwa file telah dipilih (required).

  return Object.keys(errors.value).length === 0;
};
// =======================================================
// AKHIR DARI PERUBAHAN
// =======================================================


// handleSubmit dan handleRegistrationError (tidak ada perubahan)
const handleSubmit = async () => {
  if (!validateForm()) return;
  isLoading.value = true;
  const submissionData = new FormData();
  const hashedPassword = CryptoJS.SHA256(formData.password).toString(CryptoJS.enc.Hex);
  submissionData.append('first_name', formData.first_name);
  submissionData.append('last_name', formData.last_name);
  submissionData.append('gender', formData.gender === 'L' ? 'male' : 'female');
  submissionData.append('date_of_birth', new Date(formData.date_of_birth).toISOString());
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
    handleRegistrationError(error);
  } finally {
    isLoading.value = false;
  }
};

const handleRegistrationError = (error) => {
  let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
  if (error.response?.data?.err_message) {
    errorMessage = error.response.data.err_message;
  } else if (error.response?.status === 422) {
    errorMessage = 'Data yang Anda masukkan tidak valid. Periksa kembali form.';
  }
  alert(errorMessage);
};
</script>

<style scoped>
/* Style tidak perlu diubah */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');
.register-form { font-family: 'Inter', sans-serif; }
.form-row { display: flex; gap: 16px; }
.form-row .form-group { flex: 1; }
.form-group { margin-bottom: 0; }
.icon-button { background: none; border: none; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; }
.icon-button:hover { opacity: 0.7; }
.submit-button { width: 100%; margin-top: 16px; }
@media (max-width: 768px) { .form-row { flex-direction: column; gap: 0; } }
</style>