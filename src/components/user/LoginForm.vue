<template>
  <form @submit.prevent="handleSubmit" class="login-form-wrapper">
    <div class="form-fields">
      <!-- Input untuk email -->
      <BaseInput
        id="email"
        label="Email"
        type="email"
        v-model="formData.email"
        placeholder="Masukkan email"
        :error="errors.email"
      />

      <!-- Input untuk password dengan ikon toggle visibilitas -->
      <BaseInput
        id="password"
        label="Password"
        :type="passwordFieldType"
        v-model="formData.password"
        placeholder="Masukkan password"
        :error="errors.password"
        icon-clickable
        @icon-click="togglePasswordVisibility"
      >
        <template #icon>
          <IconEye v-if="!isPasswordVisible" />
          <IconEyeSlash v-else />
        </template>
      </BaseInput>
    </div>
    
    <!-- Tombol submit dengan status loading -->
    <BaseButton type="submit" :loading="isLoading" full-width>
      Masuk
    </BaseButton>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import BaseInput from '@/components/ui/BaseInput.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconEyeSlash from '@/components/icons/IconEyeSlash.vue';

// Mendefinisikan props dan event yang digunakan komponen
defineProps({ isLoading: { type: Boolean, default: false } });
const emit = defineEmits(['submit-login']);

// State management untuk data form dan error
const formData = reactive({ email: '', password: '' });
const errors = ref({});

// State dan logika untuk toggle visibilitas password
const isPasswordVisible = ref(false);
const passwordFieldType = computed(() => isPasswordVisible.value ? 'text' : 'password');
const togglePasswordVisibility = () => { isPasswordVisible.value = !isPasswordVisible.value; };

// Validasi form sisi klien
const validateForm = () => {
  errors.value = {};
  if (!formData.email) {
    errors.value.email = 'Email wajib diisi.';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.value.email = 'Format email tidak valid.';
  }
  if (!formData.password) {
    errors.value.password = 'Password wajib diisi.';
  }
  return Object.keys(errors.value).length === 0;
};

// Menangani submit form, melakukan validasi, dan emit event
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit-login', { ...formData });
  }
};
</script>

<style scoped>
/* Wrapper ini digunakan agar form tidak mengganggu layout flex dari parent */
.login-form-wrapper { display: contents; }
.form-fields { display: flex; flex-direction: column; gap: 4px; }
</style>