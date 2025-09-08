<template>
  <!-- Menggunakan AuthLayout dengan judul dan warna panel kustom -->
  <AuthLayout title="Login Admin" panelColor="#FD5725">
    
    <!-- Wrapper ini mendefinisikan CSS Variable '--primary-color'
         sehingga semua komponen anak (seperti BaseButton dan link)
         akan mengadopsi tema warna oranye. -->
    <div class="login-container" :style="{'--primary-color': '#FD5725'}">
      
      <!-- Komponen form login yang menangani input dan validasi dasar -->
      <LoginForm 
        :is-loading="isLoading" 
        @submit-login="handleLogin"
      />
      
      <!-- Link untuk navigasi ke halaman registrasi -->
      <div class="auth-link">
        <p>Belum punya akun? <router-link to="/register">Daftar disini</router-link></p>
      </div>
    </div>
    
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CryptoJS from 'crypto-js';
import { authService } from '@/services/apiService';
import AuthLayout from '@/components/ui/AuthLayout.vue';
import LoginForm from '@/components/user/LoginForm.vue';

const router = useRouter();
const isLoading = ref(false);

// Menangani proses login saat form di-submit
const handleLogin = async (loginData) => {
  isLoading.value = true;
  // Mengenkripsi password sebelum dikirim ke API
  const hashedPassword = CryptoJS.SHA256(loginData.password).toString(CryptoJS.enc.Hex);
  const payload = { email: loginData.email, password: hashedPassword };
  
  try {
    const response = await authService.login(payload);
    // Jika berhasil, simpan token dan arahkan ke dashboard
    if (response.data?.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
      alert('Login berhasil!');
      router.push('/dashboard');
    } else {
      throw new Error('Respons tidak valid dari server.');
    }
  } catch (error) {
    // Menangani berbagai jenis error (dari server, jaringan, dll.)
    console.error('Error saat login:', error);
    let errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
    if (error.response?.data?.err_message) {
      errorMessage = error.response.data.err_message;
    } else if (error.response?.status === 401) {
      errorMessage = 'Email atau password salah.';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Gagal terhubung ke server.';
    }
    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 'display: contents' membuat div ini "transparan" terhadap layout flexbox parent,
   sehingga anaknya (LoginForm dan .auth-link) menjadi item flex langsung. */
.login-container {
  display: contents;
}

.auth-link {
  text-align: center;
}

.auth-link p {
  font-size: 14px;
  color: #666;
  font-family: 'Inter', sans-serif;
}

/* Link menggunakan warna tema yang di-set oleh CSS variable */
.auth-link a {
  color: var(--primary-color, #2E74B2); 
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>