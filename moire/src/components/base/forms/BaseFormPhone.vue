<template>
  <BaseFormField :title="title" :error="error" :pid="pid">
    <input
      class="form__input"
      v-model="dataValue"
      type="tel"
      v-mask="mask"
      :name="pid"
      :placeholder="placeholder"
      :id="pid"
    />
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';
import { mask } from 'vue-the-mask';

export default {
  props: {
    // при передаче объектом можно указать значение по умолчанию default
    mask: {
      default: '+7 (###) ###-##-##',
    },
  },
  mixins: [formFieldMixin],
  directives: { mask },
};
</script>
