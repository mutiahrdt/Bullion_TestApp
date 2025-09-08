<template>
  <div class="auth-page">
    <!-- Panel kiri dengan warna latar yang dapat dikustomisasi melalui prop -->
    <div class="left-panel" :style="{ backgroundColor: panelColor }">
      <img :src="logoWhite" alt="Bullion Ecosystem Logo" class="logo-image">
    </div>

    <!-- Panel kanan untuk menampung konten form melalui slot -->
    <div class="right-panel">
      <div class="form-container">
        <h1>{{ title }}</h1>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
// Mengimpor aset gambar yang dibutuhkan
import logoWhite from '@/assets/logo-white.png';
import backgroundGraphic from '@/assets/logo.png';

// Mendefinisikan props yang diterima komponen untuk kustomisasi
defineProps({
  // Judul yang akan ditampilkan di atas form
  title: {
    type: String,
    required: true
  },
  // Warna panel kiri, dengan warna biru sebagai default
  panelColor: {
    type: String,
    default: '#2E74B2'
  }
});

// Variabel untuk digunakan oleh `v-bind` di CSS untuk gambar latar dinamis
const backgroundImageUrl = `url(${backgroundGraphic})`;
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
.auth-page { display: flex; height: 100vh; overflow: hidden; background-color: #FFFFFF; width: 100%; }
.left-panel {
  width: 548px;
  min-width: 548px;
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
  background-image: v-bind(backgroundImageUrl); /* Mengikat gambar latar dari script */
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  opacity: 25%;
}
.logo-image { width: 104px; height: 32px; z-index: 1; }
.right-panel { flex: 1; display: flex; justify-content: center; align-items: flex-start; padding: 0 20px; overflow-y: auto; }
.form-container { width: 100%; max-width: 425px; display: flex; flex-direction: column; gap: 32px; padding: 40px 0; }
h1 { font-family: 'Montserrat', sans-serif; font-size: 36px; font-weight: 700; color: #000000; text-align: left; }

/* Media Queries untuk responsivitas */
@media (max-width: 1200px) { .left-panel { width: 35%; min-width: 280px; padding: 40px 30px; } .form-container { max-width: 380px; } h1 { font-size: 32px; } }
@media (max-width: 992px) { .auth-page { flex-direction: column; } .left-panel { width: 100%; height: 30vh; min-width: unset; min-height: 180px; padding: 30px 20px; justify-content: center; align-items: center; order: -1; } .left-panel::before { top: -30px; left: -100px; width: 300px; height: 270px; opacity: 15%; } .logo-image { width: 90px; height: 28px; } .right-panel { min-height: calc(100vh - 200px); padding: 30px 20px; } .form-container { max-width: 100%; gap: 20px; } h1 { font-size: 28px; margin-bottom: 10px; } }
@media (max-width: 768px) and (orientation: landscape) { .auth-page { flex-direction: row; } .left-panel { width: 30%; height: 100vh; min-width: 200px; order: 0; } .right-panel { min-height: 100vh; width: 70%; } .logo-image { width: 80px; height: 25px; } h1 { font-size: 24px; } }
@media (max-width: 480px) { .left-panel { height: 20vh; padding: 15px; } .logo-image { width: 70px; height: 22px; } .right-panel { padding: 15px 10px; min-height: calc(100vh - 120px); } .form-container { gap: 16px; } h1 { font-size: 22px; margin-bottom: 5px; } }
@media (max-width: 320px) { .right-panel { padding: 10px 5px; } .form-container { gap: 12px; } h1 { font-size: 20px; } }
</style>