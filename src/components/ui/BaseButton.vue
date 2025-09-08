<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <!-- Menampilkan spinner saat loading, jika tidak, tampilkan konten slot -->
    <span v-if="loading" class="loading-spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup>
import { computed } from 'vue';

// Mendefinisikan props untuk kustomisasi tombol
const props = defineProps({
  type: { type: String, default: 'button', validator: (value) => ['button', 'submit', 'reset'].includes(value) },
  variant: { type: String, default: 'primary', validator: (value) => ['primary', 'secondary', 'danger', 'outline'].includes(value) },
  size: { type: String, default: 'medium', validator: (value) => ['small', 'medium', 'large'].includes(value) },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  fullWidth: { type: Boolean, default: false }
});

// Mendefinisikan event 'click' yang bisa di-emit
defineEmits(['click']);

// Computed property untuk menghasilkan kelas CSS secara dinamis berdasarkan props
const buttonClasses = computed(() => {
  return [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
      'base-button--disabled': props.disabled || props.loading,
      'base-button--loading': props.loading,
      'base-button--full-width': props.fullWidth
    }
  ];
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

.base-button { display: inline-flex; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; font-weight: 500; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s ease-in-out; text-decoration: none; outline: none; position: relative; }
.base-button:focus {
  /* Menggunakan CSS variable untuk warna focus agar konsisten dengan tema */
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #2E74B2) 20%, transparent);
}

/* Varian tombol utama dan outline menggunakan CSS Variables (--primary-color) agar mudah di-theme */
.base-button--primary {
  background-color: var(--primary-color, #2E74B2);
  color: white;
}
.base-button--primary:hover:not(.base-button--disabled) {
  background-color: color-mix(in srgb, var(--primary-color, #2E74B2) 85%, black);
}
.base-button--outline {
  background-color: transparent;
  color: var(--primary-color, #2E74B2);
  border: 1px solid var(--primary-color, #2E74B2);
}
.base-button--outline:hover:not(.base-button--disabled) {
  background-color: var(--primary-color, #2E74B2);
  color: white;
}

/* Varian tombol lainnya */
.base-button--secondary { background-color: #f8f9fa; color: #333; border: 1px solid #E0E0E0; }
.base-button--secondary:hover:not(.base-button--disabled) { background-color: #e9ecef; }
.base-button--danger { background-color: #E53935; color: white; }
.base-button--danger:hover:not(.base-button--disabled) { background-color: #c62828; }

/* Ukuran tombol */
.base-button--small { height: 36px; padding: 8px 16px; font-size: 12px; }
.base-button--medium { height: 46px; padding: 12px 24px; font-size: 16px; }
.base-button--large { height: 56px; padding: 16px 32px; font-size: 18px; }

/* Status tombol */
.base-button--disabled { background-color: #ccc !important; color: #666 !important; cursor: not-allowed !important; border-color: #ccc !important; }
.base-button--loading { cursor: not-allowed; }
.base-button--full-width { width: 100%; }

/* Animasi spinner untuk status loading */
.loading-spinner { width: 20px; height: 20px; border: 2px solid transparent; border-top: 2px solid currentColor; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (max-width: 480px) { .base-button--medium { height: 42px; font-size: 14px; padding: 10px 20px; } .loading-spinner { width: 16px; height: 16px; } }
</style>