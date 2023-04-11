<template>
  <main class="content container">
    <!-- хлебные крошки и заголовок с кол-вом товаров -->
    <!-- <div class="content__top">
      <ProductBreadcrumbs :crumbs="breadcrumbsData" />

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info">
          {{ productsCount | countProductsString }}
        </span>
      </div>
    </div>

    <section class="cart">
      <Spinner :visible="cartLoading" size="large" />

      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.id" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice | numberFormat }} ₽</span>
          </p>

          <router-link
            tag="button"
            :to="{ name: 'order' }"
            class="cart__button button button--primery"
            type="submit"
            :style="`display:${buttonCreateOrderDisplay}`"
          >
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section> -->
  </main>
</template>

<script>
// import ProductBreadcrumbs from '@/components/base/BaseBreadcrumbs.vue';
// import { countProductsString } from '@/helpers/productCounters';
import { mapGetters, mapState } from 'vuex';
// import CartItem from '@/components/cart/CartItem.vue';
// import Spinner from '@/components/base/BaseSpinner.vue';
// import numberFormat from '@/helpers/numberFormat';

export default {
  name: 'CartView',
  // components: { ProductBreadcrumbs, CartItem, Spinner },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      productsCount: 'cartProductsCount',
      totalPrice: 'cartTotalPrice',
    }),
    ...mapState(['cartLoading', 'cartLoadingFailed']),
    breadcrumbsData() {
      return [
        {
          title: 'Каталог',
          route: 'catalog',
          force: true,
        },
        {
          title: 'Корзина',
        },
      ];
    },
    buttonCreateOrderDisplay() {
      if (this.productsCount === 0) return 'none';
      return 'inherit';
    },
  },
  filters: {
    // countProductsString,
    // numberFormat,
  },
};
</script>
