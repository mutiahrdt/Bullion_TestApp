<template>
  <div class="base-input">
    <label v-if="label" :for="id" class="label">{{ label }}</label>

    <div :class="['input-wrapper', { 'with-icon': hasIcon }]">
      <!-- Normal input / date / email / tel / password -->
      <input
        v-if="inputType !== 'textarea' && inputType !== 'file'"
        :id="id"
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        :readonly="readonly"
        class="input-element"
      />

      <!-- Textarea -->
      <textarea
        v-else-if="inputType === 'textarea'"
        :id="id"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input-element textarea"
      />

      <!-- File input (custom label + hidden input) -->
      <label
        v-else-if="inputType === 'file'"
        :for="id"
        class="file-label-custom"
      >
        <span>{{ fileLabel }}</span>
        <span class="file-right">
          <!-- if user provided explicit icon slot, use it; else fallback to mapped icon -->
          <slot name="icon">
            <component
              v-if="resolvedIcon"
              :is="resolvedIcon"
              class="input-icon"
              @click.stop="$emit('icon-click')"
            />
          </slot>
        </span>
      </label>
      <input
        v-if="inputType === 'file'"
        :id="id"
        type="file"
        :accept="accept"
        @change="onFileChange"
        style="display:none"
      />

      <!-- right icon for normal inputs -->
      <div v-else class="icon-slot" @click.stop="onIconClick">
        <!-- prefer explicit named slot -->
        <slot name="right-icon">
          <component
            v-if="resolvedIcon"
            :is="resolvedIcon"
            class="input-icon"
          />
        </slot>
      </div>
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/* import icons (sesuaikan nama file ikon Anda) */
import IconCalendar from '@/components/icons/IconCalendar.vue';
import IconChevronDown from '@/components/icons/IconChevronDown.vue';
import IconClose from '@/components/icons/IconClose.vue';
import IconEye from '@/components/icons/IconEye.vue';
import IconEyelash from '@/components/icons/IconEyeSlash.vue';
import IconPencil from '@/components/icons/IconPencil.vue';
import IconUpload from '@/components/icons/IconUpload.vue';

const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: [String, Number, Object, File, null], default: '' },
  inputType: { type: String, default: 'text' }, // text, email, password, date, file, textarea, tel
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  accept: { type: String, default: '' }, // for file input
  readonly: { type: Boolean, default: false },
  icon: { type: String, default: '' }, // icon key: 'calendar'|'chevron'|'eye'|'upload'|'pencil'|'close'|'eyelash'
});

const emit = defineEmits(['update:modelValue', 'file-change', 'focus', 'blur', 'icon-click']);

const ICONS = {
  calendar: IconCalendar,
  chevron: IconChevronDown,
  close: IconClose,
  eye: IconEye,
  eyelash: IconEyelash,
  pencil: IconPencil,
  upload: IconUpload,
};

const resolvedIcon = computed(() => {
  if (!props.icon) return null;
  return ICONS[props.icon] ?? null;
});

const hasIcon = computed(() => !!(props.icon || !!resolvedIcon.value));

const fileLabel = computed(() => {
  if (props.modelValue && typeof props.modelValue === 'object' && props.modelValue.name) {
    return props.modelValue.name;
  }
  return 'Pilih file';
});

const onFileChange = (e) => {
  const file = e.target.files?.[0] ?? null;
  emit('file-change', file);
  emit('update:modelValue', file);
};

const onIconClick = (e) => {
  // emit icon-click so parent (eg. password toggle) can respond
  emit('icon-click', e);
};
</script>

<style scoped>
.base-input { display:flex; flex-direction:column; gap:8px; }
.label { font-family: 'Montserrat', sans-serif; font-weight:700; font-size:14px; color:#000; }
.input-wrapper { position:relative; }
.input-element{
  display:block;
  width:100%;
  height:46px;
  padding:8px 16px;
  border:1px solid #E0E0E0;
  border-radius:8px;
  font-size:14px;
  font-family:'Inter', sans-serif;
  outline:none;
  background:#fff;
}
.textarea { min-height:110px; padding-top:10px; resize:vertical; }
.input-element::placeholder { color:#98A2B3; }
.input-element:focus { border-color:#2F66B2; box-shadow:0 0 0 2px rgba(47,102,178,0.2); }

.file-label-custom{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  height:46px;
  padding:8px 16px;
  border:1px solid #E0E0E0;
  border-radius:8px;
  cursor:pointer;
  font-family:'Inter', sans-serif;
  color:#98A2B3;
  background:#fff;
}
.file-right { display:flex; align-items:center; gap:8px; }

.icon-slot{
  position:absolute;
  right:0;
  top:0;
  height:100%;
  width:45px;
  display:flex;
  align-items:center;
  justify-content:center;
  pointer-events:auto; /* allow clicks */
  cursor: pointer;
}
.input-icon{ width:20px; height:20px; pointer-events:none; } /* icon svg itself won't intercept clicks */
.error-text{ color:#E53935; font-size:12px; margin-top:4px; }
</style>
