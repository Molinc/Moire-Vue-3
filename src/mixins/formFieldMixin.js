import BaseFormField from '@/components/base/forms/BaseFormField.vue';

export default {
  name: 'BaseFormText',
  components: { BaseFormField },
  props: ['title', 'error', 'placeholder', 'modelValue', 'pid'],
  emits: ['update:modelValue'],
  computed: {
    dataValue: {
      get() {
        return this.modelValue;
      },
      set(modelValue) {
        this.$emit('update:modelValue', modelValue);
      },
    },
  },
};
