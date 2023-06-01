<template>
  <BaseFormField :title="title" :error="error" :pid="pid">
    <input
      class="form__input"
      v-model="dataValue"
      :type="type"
      :name="pid"
      :placeholder="placeholder"
      :id="pid"
    />
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  props: {
    // при передаче объектом можно указать значение по умолчанию default
    type: {
      default: 'text',
    },
  },
  mixins: [formFieldMixin],
};
</script>
