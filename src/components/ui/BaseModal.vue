<template>
  <!-- Merender modal di dalam body untuk menghindari masalah z-index -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" :class="modalSizeClass" @click.stop>
          
          <!-- Header Modal: dapat diisi melalui slot atau prop 'title' -->
          <div v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h3 class="modal-title">{{ title }}</h3>
            </slot>
            <button v-if="closable" type="button" class="modal-close-button" @click="close" aria-label="Close modal">
              <slot name="close-icon"><IconClose /></slot>
            </button>
          </div>
          
          <!-- Body Modal: konten utama diisi melalui slot default -->
          <div class="modal-body"><slot /></div>
          
          <!-- Footer Modal: ditampilkan jika slot 'footer' diisi -->
          <div v-if="$slots.footer" class="modal-footer"><slot name="footer" /></div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, nextTick } from 'vue';
import IconClose from '@/components/icons/IconClose.vue';

// Mendefinisikan props untuk mengontrol visibilitas, konten, ukuran, dan perilaku modal
const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'medium', validator: (value) => ['small', 'medium', 'large', 'extra-large'].includes(value) },
  closable: { type: Boolean, default: true },
  closeOnOverlay: { type: Boolean, default: true },
  persistent: { type: Boolean, default: false } // Jika true, modal tidak bisa ditutup
});

const emit = defineEmits(['close', 'opened', 'closed']);

// Kelas CSS dinamis berdasarkan prop 'size'
const modalSizeClass = {
  'modal-container--small': props.size === 'small',
  'modal-container--medium': props.size === 'medium',
  'modal-container--large': props.size === 'large',
  'modal-container--extra-large': props.size === 'extra-large'
};

// Fungsi untuk menutup modal
const close = () => { if (!props.persistent) emit('close'); };
const handleOverlayClick = () => { if (props.closeOnOverlay) close(); };
const handleEscape = (event) => { if (event.key === 'Escape' && props.show && props.closable) close(); };

// Mengelola side-effects (seperti scroll lock dan event listener) saat modal dibuka/ditutup
watch(() => props.show, async (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    await nextTick();
    emit('opened');
  } else {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscape);
    emit('closed');
  }
});
</script>

<style scoped>
/* Styling untuk overlay, container, header, body, footer, dan animasi modal */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Inter:wght@400;500;700&display=swap');

.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; }
.modal-container { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; max-height: 90vh; max-width: 90vw; overflow: hidden; }

/* Ukuran Modal */
.modal-container--small { max-width: 400px; }
.modal-container--medium { max-width: 500px; }
.modal-container--large { max-width: 700px; }
.modal-container--extra-large { max-width: 900px; }

/* Bagian-bagian Modal */
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid #E0E0E0; }
.modal-title { font-family: 'Montserrat', sans-serif; font-size: 18px; font-weight: 700; color: #000; margin: 0; }
.modal-close-button { background: none; border: none; padding: 4px; cursor: pointer; color: #666; border-radius: 4px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.modal-close-button:hover { background-color: #f5f5f5; color: #333; }
.modal-close-button:focus { outline: 2px solid #2F66B2; outline-offset: 2px; }
.modal-body { padding: 24px; flex: 1; overflow-y: auto; font-family: 'Inter', sans-serif; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #E0E0E0; display: flex; gap: 12px; justify-content: flex-end; }

/* Transisi Animasi */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.3s ease; }
.modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: scale(0.9) translateY(-50px); }

/* Desain Responsif untuk Mobile */
@media (max-width: 480px) { .modal-overlay { align-items: flex-end; } .modal-container { max-width: 100%; width: 100%; border-radius: 12px 12px 0 0; } .modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: translateY(100%); } .modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.3s ease-out; } }
</style>