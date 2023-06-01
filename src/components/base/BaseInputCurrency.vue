<template>
  <input
    class="form__input"
    type="text"
    v-model.lazy="currentValue"
    v-money3="config"
  />
</template>

<script>
import { Money3Directive, unformat } from 'v-money3';

export default {
  name: 'InputCurrency',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      config: {
        prefix: '',
        suffix: '',
        thousands: ' ',
        decimal: ',',
        precision: 0,
        disableNegative: true,
        disabled: false,
        min: 0,
        max: null,
        allowBlank: false,
        minimumNumberOfCharacters: 0,
        shouldRound: true,
        focusOnRight: false,
        masked: true,
        modelModifiers: {
          number: false,
        },
      },
    };
  },
  computed: {
    currentValue: {
      get() {
        return this.modelValue || 0;
      },
      set(value) {
        this.$emit('update:modelValue', unformat(value, this.config));
      },
    },
  },
  directives: { money3: Money3Directive },
};
</script>
