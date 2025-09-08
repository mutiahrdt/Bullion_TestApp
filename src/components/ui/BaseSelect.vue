<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <!-- Wrapper ini penting untuk styling kustom panah dan placeholder -->
    <div class="select-wrapper" :data-empty="isEmpty" :data-placeholder="placeholder">
      <select
        :id="id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="{ error: error }"
        @change="handleChange"
      >
        <!-- Opsi placeholder yang dinonaktifkan -->
        <option disabled value="">{{ placeholder }}</option>
        <!-- Iterasi melalui opsi yang diberikan -->
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <!-- Slot untuk ikon kustom, seperti panah dropdown -->
      <div v-if="$slots.icon" class="icon">
        <slot name="icon" />
      </div>
    </div>
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Mendefinisikan props, termasuk `options` dengan validator untuk memastikan format yang benar
const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Pilih opsi' },
  options: {
    type: Array,
    required: true,
    validator: (opts) => opts.every(opt => typeof opt === 'object' && 'value' in opt && 'label' in opt)
  },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue']);

// Mengecek apakah select kosong, digunakan untuk trik placeholder di CSS
const isEmpty = computed(() => !props.modelValue);

// Meng-emit nilai baru saat opsi diubah
const handleChange = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

.form-group { display: flex; flex-direction: column; gap: 16px; padding-bottom: 16px; }
label { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #000000; }
.select-wrapper { position: relative; }

select {
  display: block; width: 100%; height: 46px; padding: 8px 48px 8px 16px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background-color: white; font-weight: 400;
  -webkit-appearance: none; -moz-appearance: none; appearance: none; /* Menghilangkan styling default browser */
  cursor: pointer;
}

/* Styling state untuk select */
select:focus { border-color: #2F66B2; box-shadow: 0 0 0 2px rgba(47, 102, 178, 0.2); }
select.error { border-color: #E53935; }
select:disabled { background-color: #f5f5f5; cursor: not-allowed; opacity: 0.6; }

/* Trik Placeholder Kustom: Sembunyikan teks asli saat kosong... */
.select-wrapper[data-empty="true"] select { color: transparent !important; }

/* ...dan tampilkan placeholder menggunakan pseudo-element ::after */
.select-wrapper[data-empty="true"]::after {
  content: attr(data-placeholder); position: absolute; left: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #98A2B3; font-size: 14px;
}

select option { color: #000; }

.icon { position: absolute; top: 0; right: 0; height: 100%; width: 45px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.error-text { color: #E53935; font-size: 12px; margin-top: -12px; }

/* Desain Responsif */
@media (max-width: 480px) {
  select { height: 42px; font-size: 12px; padding: 8px 35px 8px 10px; }
  .select-wrapper[data-empty="true"]::after { left: 10px; font-size: 12px; }
  .icon { width: 35px; } label { font-size: 12px; } .error-text { font-size: 11px; }
}
</style>