<template>
  <div class="form-group">
    <label v-if="label" :for="id">{{ label }}</label>
    <div class="custom-file-input">
      <!-- Label kustom yang berfungsi sebagai tombol untuk memicu input file asli -->
      <label :for="id" class="file-label" :class="{ error: error }">
        <span class="file-text">{{ displayText }}</span>
        <span class="icon">
          <!-- Slot untuk ikon, dengan IconUploadCloud sebagai default -->
          <slot name="icon">
            <IconUploadCloud />
          </slot>
        </span>
      </label>
      <!-- Input file asli yang disembunyikan -->
      <input
        :id="id"
        ref="fileInput"
        type="file"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        style="display: none"
        @change="handleFileChange"
      />
    </div>
    <!-- Informasi bantuan mengenai ukuran dan format file yang diizinkan -->
    <div v-if="maxSize || allowedFormats.length" class="file-info">
      <span v-if="maxSize">Maksimal ukuran: {{ formatFileSize(maxSize) }}</span>
      <span v-if="maxSize && allowedFormats.length"> • </span>
      <span v-if="allowedFormats.length">Format: {{ formatAllowedTypes }}</span>
    </div>
    <!-- Menampilkan pesan error jika ada -->
    <span v-if="error" class="error-text">{{ error }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconUploadCloud from '@/components/icons/IconUpload.vue'; // Ikon default

// Mendefinisikan props untuk konfigurasi, termasuk v-model (modelValue) dan validasi
const props = defineProps({
  id: { type: String, required: true },
  modelValue: { type: [File, null], default: null },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Pilih foto profil' },
  accept: { type: String, default: '' },
  maxSize: { type: Number, default: null },
  allowedFormats: { type: Array, default: () => [] },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'error']);
const fileInput = ref(null);

// Teks yang ditampilkan: nama file jika ada, atau placeholder jika kosong
const displayText = computed(() => props.modelValue ? props.modelValue.name : props.placeholder);

// Memformat array format file menjadi string yang mudah dibaca
const formatAllowedTypes = computed(() => props.allowedFormats.map(type => type.split('/')[1].toUpperCase()).join(', '));

// Fungsi helper untuk memformat ukuran file dari bytes
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Fungsi untuk memvalidasi file berdasarkan ukuran dan format
const validateFile = (file) => {
  const errors = [];
  if (props.maxSize && file.size > props.maxSize) {
    errors.push(`Ukuran file maksimal adalah ${formatFileSize(props.maxSize)}.`);
  }
  if (props.allowedFormats.length > 0 && !props.allowedFormats.includes(file.type)) {
    errors.push(`Format file harus ${formatAllowedTypes.value}.`);
  }
  return errors;
};

// Menangani perubahan file, melakukan validasi, dan meng-emit event
const handleFileChange = (event) => {
  const file = event.target.files?.[0] || null;
  if (!file) {
    emit('update:modelValue', null);
    return;
  }
  emit('error', '');
  const validationErrors = validateFile(file);
  if (validationErrors.length > 0) {
    emit('error', validationErrors[0]);
    if (fileInput.value) fileInput.value.value = '';
    emit('update:modelValue', null);
    return;
  }
  emit('update:modelValue', file);
};

// Method untuk membersihkan file dari luar komponen
const clearFile = () => {
  if (fileInput.value) fileInput.value.value = '';
  emit('update:modelValue', null);
  emit('error', '');
};

// Mengekspos method `clearFile` agar bisa dipanggil dari komponen induk
defineExpose({ clearFile });
</script>

<style scoped>
/* Styling untuk input file kustom, termasuk state hover, focus, dan error */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

.form-group { display: flex; flex-direction: column; gap: 16px; padding-bottom: 16px; }
label { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 700; color: #000000; }
.custom-file-input { position: relative; }
.file-label { display: flex; justify-content: space-between; align-items: center; width: 100%; height: 46px; padding: 8px 13px 8px 16px; border: 1px solid #E0E0E0; border-radius: 8px; font-size: 14px; font-family: 'Inter', sans-serif; color: #98A2B3; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; background-color: white; font-weight: 400; }
.file-label:hover:not(.disabled) { border-color: #2F66B2; }
.file-label:focus-within { border-color: #2F66B2; box-shadow: 0 0 0 2px rgba(47, 102, 178, 0.2); }
.file-label.error { border-color: #E53935; }
.file-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; margin-right: 8px; text-align: left; }
.icon { flex-shrink: 0; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; color: #FD5725; }
.file-info { font-size: 12px; color: #666; font-family: 'Inter', sans-serif; }
.error-text { color: #E53935; font-size: 12px; font-family: 'Inter', sans-serif; }
input:disabled + .file-label { background-color: #f5f5f5; cursor: not-allowed; opacity: 0.6; }

@media (max-width: 480px) { .file-label { height: 42px; font-size: 12px; } .error-text, .file-info { font-size: 11px; } }
</style>