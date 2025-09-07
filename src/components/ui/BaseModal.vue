<template>
  <div v-if="modelValue" class="modal-backdrop" @click.self="close">
    <div class="modal" role="dialog" aria-modal="true">
      <header class="modal-header">
        <slot name="header">
          <h3 class="modal-title">{{ title }}</h3>
        </slot>
        <button class="modal-close" @click="close" aria-label="Close">✕</button>
      </header>

      <section class="modal-body">
        <slot />
      </section>

      <footer class="modal-footer">
        <slot name="footer">
          <button @click="close" class="btn-cancel">Tutup</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);

const close = () => emit('update:modelValue', false);
</script>

<style scoped>
.modal-backdrop{
  position: fixed;
  inset:0;
  background: rgba(0,0,0,0.4);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:1000;
}
.modal{
  width: 100%;
  max-width: 520px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}
.modal-header{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:16px;
  border-bottom:1px solid #eee;
}
.modal-title{ font-weight:700; font-family: 'Montserrat', sans-serif; }
.modal-close{
  background:transparent;
  border:none;
  font-size:18px;
  cursor:pointer;
}
.modal-body{ padding:16px; }
.modal-footer{ padding:12px 16px; border-top:1px solid #eee; display:flex; justify-content:flex-end; gap:8px; }
.btn-cancel{
  background:#eee;
  border:none;
  padding:8px 12px;
  border-radius:8px;
  cursor:pointer;
}
</style>
