<template>
  <fieldset class="form__block">
    <legend class="form__legend">Размер</legend>
    <label class="form__label form__label--small form__label--select">
      <select class="form__select" name="size" v-model="currentSize">
        <option v-for="size in sizes" :key="size.id" :value="size.id">
          {{ size.title }}
        </option>
      </select>
    </label>
  </fieldset>
</template>

<script>
export default {
  name: 'SizesSelect',
  props: ['sizes', 'size'], // ! обязательно указываем модельный параметр, чтобы считать из него значение при инициализации компонента!
  emits: ['update:size'],
  computed: {
    currentSize: {
      get() {
        return this.size;
      },
      set(value) {
        this.$emit('update:size', value);
      },
    },
  },
};
</script>
