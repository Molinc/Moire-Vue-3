<template>
  <ul class="catalog__list" v-show="checkList()">
    <ProductItem
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </ul>
</template>

<script>
import ProductItem from './ProductItem.vue';

export default {
  name: 'ProductList',
  props: ['products'], // ! входные параметры - список продуктов
  components: {
    ProductItem,
  },
  methods: {
    checkList() {
      return this.products?.length;
    },
  },
};
</script>
