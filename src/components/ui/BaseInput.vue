<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="input-wrapper" :class="{ 'has-icon': $slots.icon || type === 'date' }">
      <!-- Input utama yang diikat dengan v-model dan atribut lainnya -->
      <input
        :id="id"
        :type="currentType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="{ error: error }"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <!-- Wrapper untuk ikon, ditampilkan jika ada slot icon atau tipenya 'date' -->
      <div 
        v-if="$slots.icon || type === 'date'"
        class="icon"
        :class="{ 'icon--clickable': iconClickable }"
        @click.stop="handleIconClick"
      >
        <slot name="icon">
          <!-- Ikon kalender default untuk input tipe 'date' -->
          <IconCalendar v-if="type === 'date'" />
        </slot>
      </div>
    </div>
    <!-- Teks error yang akan ditampilkan jika prop `error` diisi -->
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconCalendar from '@/components/icons/IconCalendar.vue';

// Mendefinisikan props untuk kustomisasi dan fungsionalitas komponen
const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  iconClickable: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'icon-click']);
const isFocused = ref(false);

// Trik untuk input tanggal: tampilkan sebagai 'text' agar placeholder terlihat,
// ubah menjadi 'date' saat fokus atau sudah ada isinya.
const currentType = computed(() => {
  if (props.type === 'date' && !props.modelValue && !isFocused.value) {
    return 'text';
  }
  return props.type;
});

// Menangani event focus dan blur untuk logika 'currentType'
const handleFocus = (event) => { isFocused.value = true; emit('focus', event); };
const handleBlur = (event) => { isFocused.value = false; emit('blur', event); };
const handleIconClick = () => { if (props.iconClickable) emit('icon-click'); };
</script>

<style scoped>
/* Styling untuk komponen input, termasuk state focus, error, dan disabled */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

.form-group { display: flex; flex-direction: column; gap: 16px; padding-bottom: 16px; }
label { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #000000; }
.input-wrapper { position: relative; }
input { display: block; width: 100%; height: 46px; padding: 8px 16px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background-color: white; font-weight: 400; }
input::placeholder { color: #98A2B3; }
input:focus { border-color: var(--primary-color, #2E74B2); box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #2E74B2) 20%, transparent); }
input.error { border-color: #E53935; }
input:disabled { background-color: #f5f5f5; cursor: not-allowed; opacity: 0.6; }

/* Styling untuk ikon di dalam input */
.icon { color: var(--primary-color, #2E74B2); position: absolute; top: 0; right: -2px; height: 100%; width: 45px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.icon--clickable { cursor: pointer; pointer-events: auto; }
.icon--clickable:hover { opacity: 0.7; }
.has-icon input { padding-right: 5px; }

/* Styling khusus untuk input tanggal agar ikon kalender berfungsi */
input[type="date"] { color: #98A2B3; position: relative; }
input[type="date"]:focus, input[type="date"]:valid { color: #000000; }
input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0; position: absolute; right: 0; width: 100%; height: 100%; cursor: pointer; }

.error-text { color: #E53935; font-size: 12px; margin-top: -12px; }

/* Desain Responsif */
@media (max-width: 480px) { input { height: 42px; font-size: 12px; padding: 8px 10px; } .icon { width: 35px; } label { font-size: 12px; } .error-text { font-size: 11px; } }
</style>