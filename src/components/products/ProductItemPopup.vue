<template>
  <Popup
    :title="product.title"
    submit-button-title="В корзину"
    @cancel="cancelAddingToCart"
    @submit="addToCart"
  >
    <section class="item-popup">
      <SpinnerSpring
        class="item-popup__spinner"
        :visible="productLoading"
        size="medium"
      />
      <section class="item item-popup__content">
        <!-- фото -->
        <ProductViewPhotos
          class="item-popup__photos"
          :photos="photos"
          v-model:photo-id="photo"
          :title="product.title"
          :gallery-visible="false"
          main-photo-height="100%"
        />

        <!-- параметры -->
        <div class="item-popup__params">
          <span class="item__code">Артикул: {{ product.id }}</span>
          <h2 class="item__title item-popup__title">{{ product.title }}</h2>

          <!-- количество -->
          <div class="item__row item__row--center">
            <BaseCounter min-val="1" v-model:amount="amount" />
            <!-- цена -->
            <b v-if="!productLoading" class="item__price item-popup__price"
              >{{ numberFormat(product.price) }} ₽</b
            >
          </div>

          <div class="item__row">
            <!-- цвет -->
            <ColorsSelect :colors="product.colors" v-model:color="color" />
            <!-- размер -->
            <SizesSelect :sizes="product.sizes" v-model:size="size" />
          </div>
        </div>
      </section>
    </section>
  </Popup>
</template>

<style lang="sass">
.item-popup
  display: flex
  flex-direction: column
  justify-content: stretch
  align-items: stretch
  max-height: 100%
  width: 100%
  &__spinner
    flex-grow: 0
    flex-shrink: 0
  &__content
    flex-grow: 1
    flex-shrink: 1
    display: grid
    grid-template-columns: 1fr 2fr
    margin-bottom: 20px
    width: 100%
    height: 100%
  &__photos
    max-height: 400px
  &__title
    margin: 10px 0
    font-size: 34px
  &__price
    font-size: 30px
</style>

<script>
import Popup from '@/components/base/BasePopup.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import ProductViewPhotos from './ProductViewPhotos.vue';
import BaseCounter from '@/components/base/BaseCounter.vue';
import ColorsSelect from '@/components/products/selects/ProductColorsSelect.vue';
import SizesSelect from '@/components/products/selects/ProductSizesSelect.vue';
import functionsMixin from '@/mixins/functionsMixin';
import photosGallery from '@/helpers/colorsPhotosGallery';
import { apiLoadProduct } from '@/api/api';
import { errors } from '@/mixins/dictsMixin';

export default {
  name: 'PopupProductView',
  props: ['productId', 'colorId'],
  emits: ['cancelled', 'added:productToCart'],
  data() {
    return {
      color: null,
      size: null,
      photo: null,
      amount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productLoadingErrorCode: null,
    };
  },
  computed: {
    product() {
      return this.productData ? { ...this.productData } : {};
    },
    photos() {
      if (!this.product?.colors?.length) return [];
      return photosGallery(this.product.colors, this.colorId);
    },
    productGallery() {
      if (!this.product?.colors?.length) return [];

      const productColorsArrayItem = this.product.colors.find(
        (item) => item.id === this.color, // выбираются фото нужного цвета
      );

      if (!productColorsArrayItem || !productColorsArrayItem.gallery?.length)
        return [];

      return productColorsArrayItem.gallery;
    },
    // получить код из справочника цветов под коду цвета из объекта товара
    getColorId() {
      if (!this.product?.colors?.length) return '';
      const color = this.product.colors.find((item) => {
        return item.id === this.color;
      });
      return color?.color.id;
    },
  },
  methods: {
    cancelAddingToCart() {
      this.$emit('cancelled');
    },
    addToCart() {
      const currentProduct = {
        productId: this.product?.id,
        colorId: this.getColorId,
        sizeId: this.size,
        quantity: this.amount,
      };

      this.$emit('added:productToCart', currentProduct);
    },

    startLoading() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      clearTimeout(this.loadProductTimer);
    },
    stopLoading() {
      this.productLoading = false;
    },
    // + notification
    loadProduct() {
      this.startLoading();
      // таймер для того, чтобы при изменении фильтров не вызывалась загрузка несколько раз подряд
      this.loadProductTimer = setTimeout(() => {
        apiLoadProduct(this.productId)
          .then((response) => {
            this.productData = response.data;
          })
          .catch((error) => {
            this.productLoadingErrorCode = error.response.status;
            this.productLoadingFailed = true;

            this.addNotification({
              text:
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? error.response.statusText,
              type: 'error',
            });
          })
          .finally(() => this.stopLoading());
      }, 0);
    },
  },
  watch: {
    product() {
      // здесь нужен наблюдатель, т.к. продукт требует времени для загрузки
      this.color = this.colorId || this.product.colors[0].id; // цвет берется из параметра маршрутизации
      this.size = this.product.sizes[0].id; // первый доступный размер
    },
    productId() {
      this.loadProduct();
    },

    // -----------------------------------------------------
    color() {
      // список фото выбранного цвета
      const newColorPhotos = this.photos.filter((value) => {
        return value.color === this.color;
      });
      if (!newColorPhotos?.length) return;

      // если список id фото выбранного цвета не включают текущее фото, выбрать первое фото этого списка
      if (!newColorPhotos.map((item) => item.id).includes(this.photo)) {
        this.photo = newColorPhotos[0].id;
      }
    },
    // -----------------------------------------------------
    photo() {
      // цвет выбранного фото
      const newColor = this.photos.find(
        (item) => item.id === this.photo,
      )?.color;
      if (!newColor) return;

      // если цвет выбранного фото не совпадает с цветом текущего фото, поменять текущий цвет (теоретически в этом смысла нет)
      if (newColor !== this.color) {
        this.color = newColor;
      }
    },
  },
  components: {
    Popup,
    SpinnerSpring,
    ProductViewPhotos,
    BaseCounter,
    ColorsSelect,
    SizesSelect,
  },
  mixins: [functionsMixin],
  mounted() {
    this.loadProduct();
  },
};
</script>
