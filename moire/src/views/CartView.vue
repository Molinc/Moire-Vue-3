<template>
  <main class="content container">
    <!-- хлебные крошки и заголовок с кол-вом товаров -->
    <div class="content__top">
      <Breadcrumbs :crumbs="breadcrumbsData" />

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info">
          {{ countProductsString(productsCount) }}
        </span>
      </div>
    </div>

    <section class="cart">
      <SpinnerSpring :visible="cartLoading" size="large" />

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
            Итого: <span>{{ numberFormat(totalPrice) }} ₽</span>
          </p>

          <router-link :to="{ name: 'order' }">
            <button
              class="cart__button button button--primery"
              type="submit"
              :style="`display:${buttonCreateOrderDisplay}`"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import Breadcrumbs from '@/components/base/BaseBreadcrumbs.vue';
import { mapGetters } from 'vuex';
import CartItem from '@/components/cart/CartItem.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import functionsMixin from '@/mixins/functionsMixin';

export default {
  name: 'CartView',
  components: {
    Breadcrumbs,
    SpinnerSpring,
    CartItem,
  },
  computed: {
    ...mapGetters({
      products: 'cartDetailProducts',
      productsCount: 'cartProductsCount',
      totalPrice: 'cartTotalPrice',
    }),
    ...mapGetters(['cartLoading', 'cartLoadingFailed']),
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
  mixins: [functionsMixin],
};
</script>
