<!-- INI KODE BARU UNTUK src/App.vue -->
<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* Anda bisa menambahkan style global di sini jika perlu, atau biarkan kosong */
/* Menghapus 'scoped' agar style bisa berlaku global jika dibutuhkan */
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif; /* Pastikan font Inter sudah di-import di index.html atau di sini */
}
</style>