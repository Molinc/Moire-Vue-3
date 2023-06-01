<template>
  <li class="catalog__item" v-show="checkProduct()">
    <ProductItemPopup
      v-if="isModalOpened"
      :product-id="product.id"
      :color-id="color"
      @cancelled="onCancelledAddingToCart"
      @added:productToCart="onAddedToCart"
    />

    <!-- ! html-способ маршрутизации -->
    <!-- ! все прочие параметры, не учитываемые в маршрутизаторе, в частности цвет, отправляем в query! -->
    <router-link
      class="catalog__link"
      :to="{ name: 'product', params: { id: product.id }, query: { color } }"
    >
      <div class="catalog__pic">
        <img :src="productImage" :alt="product.title" />
      </div>

      <h3 class="catalog__title">
        <a href="#">{{ product.title }}</a>
      </h3>
    </router-link>

    <div class="catalog__price">{{ numberFormat(product.price) }} ₽</div>

    <div class="catalog__wrapper">
      <ul class="colors colors--black">
        <li
          class="colors__item"
          v-for="productColor in [...product.colors]"
          :key="product.id + productColor.id"
        >
          <label class="colors__label">
            <input
              class="colors__radio sr-only"
              type="radio"
              :name="product.id"
              :value="productColor.id"
              v-model="color"
              @change.prevent="changeColor(productColor.id)"
            />
            <span
              class="colors__value"
              :style="{ 'background-color': productColor.color?.code }"
              :title="productColor.color?.title"
            ></span>
          </label>
        </li>
      </ul>

      <CartAddButton
        :added="isAdded"
        :adding="isAdding"
        :title="cartAddButtonTitle"
        @click="modalOpen"
      />
      <!-- .native используется, чтобы вызвать событие клик на компоненте! - но во Vue 3 все клики по умолчанию нативные -->
      <!-- поэтому НЕЛЬЗЯ давать дефолтные имена своим кастомным событиям, иначе дефолтные обработчики, если таковые есть, не сработают! -->
    </div>
  </li>
</template>

<style lang="sass">
.catalog__link
  margin-bottom: auto
.catalog__price
  margin-top: 10px
.catalog__wrapper
  display: flex
  justify-content: space-between
  align-items: center
.catalog__title
  margin-bottom: auto
.catalog__item
  display: flex
  flex-direction: column
.colors__value
  box-shadow: 0 0 5px lightgray
</style>

<script>
import CartAddButton from '@/components/cart/buttons/CartAddButton.vue';
import functionsMixin from '@/mixins/functionsMixin';
import { defineAsyncComponent } from 'vue';
import { mapActions } from 'vuex';

const defaultImageSrc = require('@/assets/no-photo.jpg'); // использование фото по умолчанию

export default {
  name: 'ProductItem',
  props: ['product'],
  data: () => {
    return {
      color: 0,
      isAdding: false,
      productToAdd: null,
      isModalOpened: false,
    };
  },
  computed: {
    productImage() {
      if (!this.product?.colors?.length) return '';

      const productColorsArrayItem = this.product.colors.find(
        (item) => item.id === this.color,
      );

      if (
        !productColorsArrayItem ||
        !productColorsArrayItem.gallery?.length ||
        !productColorsArrayItem.gallery[0].file?.url
      )
        return defaultImageSrc;

      return productColorsArrayItem.gallery[0].file.url;
    },
    isAdded() {
      // отфильтровать только по артикулу и количеству (если есть любого цвета, то считаем как "добавлено" - true)
      let items = this.product.itemsAdded?.filter((item) => {
        return item.productId === this.product.id && item.quantity > 0;
      });
      return items && items.length > 0;
    },
    cartAddButtonTitle() {
      return this.isAdded ? 'Добавлено в корзину' : 'Добавить в корзину';
    },
  },
  methods: {
    ...mapActions(['addNotification', 'addProductToCart']),

    checkProduct() {
      return (
        this.product && typeof this.product === 'object' && this.product.title
      );
    },
    changeColor(value) {
      this.color = value;
    },
    modalOpen() {
      this.isAdding = true;
      this.isModalOpened = true;
    },
    onCancelledAddingToCart() {
      this.isAdding = false;
      this.isModalOpened = false;
    },
    onAddedToCart(event) {
      const currentProduct = event;

      // если товар не найден, не запускать axios
      if (!currentProduct.productId) {
        this.addNotification({
          text: 'Товар не найден!',
          type: 'error',
        });
        return;
      }

      this.addProductToCart(currentProduct)
        .then(() => {
          this.addNotification({
            text: 'Товар добавлен в корзину',
            type: 'notify',
          });
        })
        .catch((error) => {
          console.log(error);
          this.addNotification({
            text: 'Ошибка добавления в корзину',
            type: 'error',
          });
        })
        .finally(() => {
          this.isAdding = false;
        });

      // сразу закрываем, чтобы диалоговое окно не висело
      this.isModalOpened = false;
    },
  },
  components: {
    CartAddButton,
    // асинхронное подключение компонентов (по мере открытия модального окна)
    ProductItemPopup: defineAsyncComponent({
      loader: () => import('@/components/products/ProductItemPopup.vue'),
      delay: 0,
      loadingComponent: () => '<h2>Загрузка...</h2>',
    }),
  },
  mixins: [functionsMixin],
  mounted() {
    // подключаем из всех возможных цветов тот, который присущ данному товару
    // здесь наблюдатели не нужны, т.к. продукт уже загружен на главной странице
    this.color = this.product?.colors[0]?.id;
  },
};
</script>
