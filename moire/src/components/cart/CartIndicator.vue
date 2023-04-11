<template>
  <router-link
    class="header__cart"
    aria-label="Корзина с товарами"
    :to="{ name: 'cart' }"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">
      <Spinner :visible="cartLoading" size="tiny" />
      <div v-if="!cartLoading">{{ cartProductsCount }}</div>
    </span>
  </router-link>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Spinner from '../base/BaseSpinner.vue';

export default {
  name: 'CartIndicator',
  components: { Spinner },
  computed: {
    ...mapGetters(['cartProductsCount', 'cartProductsItemsCount']),
    ...mapState(['cartLoading', 'cartLoadingFailed']),
  },
};
</script>
