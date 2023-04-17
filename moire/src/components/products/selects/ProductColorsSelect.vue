<template>
  <fieldset class="form__block">
    <legend class="form__legend">Цвет</legend>
    <ul class="colors colors--black">
      <li
        class="colors__item"
        v-for="productColor in colors"
        :key="productColor.id"
      >
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            name="color-item"
            :value="productColor.id"
            v-model="currentColor"
          />
          <span
            class="colors__value"
            :style="{ 'background-color': productColor.color.code }"
            :title="productColor.title"
          >
          </span>
        </label>
      </li>
    </ul>
  </fieldset>
</template>

<script>
export default {
  name: 'ColorsSelect',
  props: ['colors', 'color'], // ! обязательно указываем модельный параметр, чтобы считать из него значение при инициализации компонента!
  emits: ['update:color'],
  computed: {
    currentColor: {
      get() {
        return this.color;
      },
      set(value) {
        this.$emit('update:color', value);
      },
    },
  },
};
</script>
