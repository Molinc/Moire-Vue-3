<template>
  <BaseFormField :pid="pid" :title="title" :error="error">
    <textarea
      class="form__input form__input--area"
      v-model="dataValue"
      :placeholder="placeholder"
      :name="pid"
      :id="pid"
    ></textarea>
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  name: 'BaseFormTextArea',
  mixins: [formFieldMixin],
};
</script>
