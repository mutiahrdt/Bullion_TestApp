<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
    @click="$emit('click', $event)"
  >
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  label: { type: String, default: '' },
});
</script>

<style scoped>
.base-button{
  width: 100%;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2E74B2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: background-color .2s;
  padding: 0 16px;
}
.base-button:hover:enabled{
  background-color: #255d8f;
}
.base-button:disabled{
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
