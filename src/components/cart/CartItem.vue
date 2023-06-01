<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="imageSrc"
        width="120"
        height="120"
        :alt="item.product.title"
        @click.prevent="
          $router.push({
            name: 'product',
            params: { id: item.product.id },
            query: { color: colorId },
          })
        "
      />
    </div>
    <h3 class="product__title">
      <span>{{ `${item.product.title}` }}</span>
      <span>{{ `(размер ${item.sizeCaption})` }}</span>
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i
          class="product__color"
          :style="{ 'background-color': item.colorCode }"
        ></i>
        {{ item.colorCaption }}
      </span>
    </p>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <BaseCounter min-val="1" v-model:amount.number="amount" />

    <b class="product__price">
      {{ numberFormat(item.product.price * amount) }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.id)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<style lang="sass">
.product__color
  box-shadow: 0 0 5px lightgray
</style>

<script>
import BaseCounter from '@/components/base/BaseCounter.vue';
import functionsMixin from '@/mixins/functionsMixin';
import { mapActions } from 'vuex';
import defaultImageSrc from '@/assets/no-photo.jpg';

export default {
  name: 'CartItem',
  props: ['item'],
  computed: {
    amount: {
      get() {
        return this.item.amount; // ! извлекаем значение из корзины продуктов
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', {
          id: this.item.id,
          amount: value,
        }); // ! вызываем мутацию в корзине продуктов
      },
    },
    imageSrc() {
      return this.item.image === '' ? defaultImageSrc : this.item.image;
    },
    colorId() {
      if (!this.item?.product?.colors?.length) return '';
      return this.item.product.colors.find(
        (color) => color.color.id === this.item.colorId,
      )?.id;
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    async deleteProduct(id) {
      this.deleteCartProduct(id)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: { BaseCounter },
  mixins: [functionsMixin],
};
</script>
