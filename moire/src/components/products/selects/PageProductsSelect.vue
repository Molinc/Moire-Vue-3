<template>
  <div class="page-products">
    <label
      class="form__label form__label--select page-products__label"
      for="page-products-count"
    >
      <span class="page-products__text">Товаров на странице:</span>
      <select
        class="form__select page-products__select"
        name="page-products"
        id="page-products-count"
        v-model="currentProductsPerPage"
      >
        <option v-for="item in productsPerPageList" :value="item" :key="item">
          {{ item }}
        </option>
      </select>
    </label>
  </div>
</template>

<style lang="sass">
.page-products
  align-self: flex-end
  margin-bottom: 20px
  min-width: 300px
  &__label
    display: flex
    align-items: center
    justify-content: flex-end
  &__text
    flex-grow: 10
    margin-right: 10px
    text-align: end
  &__select
    padding: 10px 10px
    background-color: #fafafa
    border: 1px solid #fafafa
    width: 80px
    height: 40px
    font-weight: 700
</style>

<script>
import { productsPerPageList } from '@/mixins/dictsMixin.js';

export default {
  name: 'PageProductsSelect',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  computed: {
    productsPerPageList() {
      return productsPerPageList;
    },
    currentProductsPerPage: {
      get() {
        return this.modelValue || 1; // если 1, значит, данные не подтягиваются
      },
      set(value) {
        if (value == this.currentProductsPerPage) return;
        this.$emit('update:modelValue', value);
      },
    },
  },
};
</script>
