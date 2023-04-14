<template>
  <router-link
    class="header__cart"
    aria-label="Корзина с товарами"
    :to="{ name: 'cart' }"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>

    <SpinnerSpring
      class="spinner-indicator"
      :visible="cartLoading"
      size="small"
    />

    <div
      class="header__count"
      aria-label="Количество товаров"
      v-if="!cartLoading"
    >
      {{ cartProductsCount }}
    </div>
  </router-link>
</template>

<style lang="sass">
.spinner-indicator
  position: absolute
  bottom: -2px
  right: 0
  margin: 0
.header__count
  bottom: -2px
  display: flex
  justify-content: center
  align-items: center
  padding-bottom: 1px
  min-width: 15px
  height: 15px
</style>

<script>
import { mapGetters } from 'vuex';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';

export default {
  name: 'CartIndicator',
  components: { SpinnerSpring },
  computed: {
    ...mapGetters([
      'cartProductsCount',
      'cartProductsItemsCount',
      'cartLoading',
      'cartLoadingFailed',
    ]),
  },
};
</script>
