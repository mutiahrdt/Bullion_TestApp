<template>
  <!-- Menggunakan AuthLayout sebagai pembungkus halaman registrasi -->
  <AuthLayout title="Daftar">
    <!-- Menempatkan komponen form registrasi di dalam slot default layout -->
    <RegisterForm />
  </AuthLayout>
</template>

<script setup>
// Mengimpor komponen yang diperlukan untuk menyusun halaman
import AuthLayout from '@/components/ui/AuthLayout.vue';
import RegisterForm from '@/components/user/RegisterForm.vue';
</script>