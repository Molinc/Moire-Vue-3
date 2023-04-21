<template>
  <main class="content container">
    <div class="content__top">
      <ProductBreadcrumbs :crumbs="breadcrumbsData" />
    </div>

    <SpinnerSpring :visible="productLoading" size="large" />

    <section class="item">
      <!-- фотографии -->
      <ProductViewPhotos
        :photos="photos"
        v-model:photo-id="photo"
        :title="product.title"
        main-photo-height="700px"
      />

      <!-- информация -->
      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">{{ product.title }}</h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart()"
          >
            <!-- блок добавления в корзину -->
            <div class="item__row item__row--center">
              <BaseCounter min-val="1" v-model:amount.number="amount" />

              <b v-if="!productLoading" class="item__price">
                {{ numberFormat(product.price) }} ₽
              </b>
            </div>

            <!-- блок с переключателями характеристик -->
            <div class="item__row">
              <!-- цвет -->
              <ColorsSelect :colors="product.colors" v-model:color="color" />
              <!-- размер -->
              <SizesSelect :sizes="product.sizes" v-model:size="size" />
            </div>

            <button
              class="item__button button button--primery button__basket-append"
              type="submit"
              :disabled="productAdding"
            >
              <span>
                В корзину
                <SpinnerSpring
                  class="spinner spinner--basket-appending"
                  :visible="productAdding"
                  size="medium"
                  color="white"
                />
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- описание товара (2 вкладки) -->
      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{
                'tabs__link--current': contentBlockCurrent === 'info',
              }"
              @click.prevent="changeContentBlock('info')"
            >
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{
                'tabs__link--current': contentBlockCurrent === 'delivery',
              }"
              @click.prevent="changeContentBlock('delivery')"
            >
              Доставка и возврат
            </a>
          </li>
        </ul>

        <!-- вкладка с описанием -->
        <div v-if="contentBlockCurrent === 'info'" class="item__content">
          <h3>Состав:</h3>

          <p>
            <span v-for="material in product.materials" :key="material.id">
              {{ material.title }}<br />
            </span>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br />
            Гладить при макс. 110ºC<br />
            Не использовать машинную сушку<br />
            Отбеливать запрещено<br />
            Не подвергать химчистке<br />
          </p>
        </div>

        <!-- вкладка с доставкой -->
        <div
          v-else-if="contentBlockCurrent === 'delivery'"
          class="item__content"
        >
          <h3>Доставка:</h3>

          <p>
            1. Курьерская доставка по Москве и Московской области – 290 ₽<br />
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете
            посмотреть здесь<br />
          </p>

          <h3>Возврат:</h3>

          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине
            БЕСПЛАТНО.<br />
            Вы можете вернуть товары в любой магазин. Магазин должен быть
            расположен в стране, в которой Вы осуществили покупку. БЕСПЛАТНЫЙ
            возврат в Пункт выдачи заказов.<br />
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи
            заказов, позвоните по телефону 8 800 600 90 09<br />
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="sass">
.button__basket-append
  padding-top: 30px
  span
    position: relative
    .spinner--basket-appending
      position: absolute
      object-fit: cover
      top: -8px
      left: -44px
      width: 32px
      height: 32px
      margin: 0
</style>

<script>
import ProductBreadcrumbs from '@/components/base/BaseBreadcrumbs.vue';
import BaseCounter from '@/components/base/BaseCounter.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import { mapActions } from 'vuex';
import { errors } from '@/mixins/dictsMixin.js';
import ProductViewPhotos from '@/components/products/ProductViewPhotos.vue';
import ColorsSelect from '@/components/products/selects/ProductColorsSelect.vue';
import SizesSelect from '@/components/products/selects/ProductSizesSelect.vue';
import photosGallery from '@/helpers/colorsPhotosGallery';
import { apiLoadProduct } from '@/api/api';
import functionsMixin from '@/mixins/functionsMixin';

export default {
  name: 'ProductView',
  data() {
    return {
      color: null,
      photo: null,
      size: null,
      contentBlockCurrent: 'info',
      amount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productLoadingErrorCode: null,
      productAdded: false,
      productAdding: false,
    };
  },
  computed: {
    product() {
      return this.productData ? { ...this.productData } : {};
    },
    breadcrumbsData() {
      const crumbs = [];

      // 1 звено
      crumbs.push({
        title: 'Каталог',
        route: 'catalog',
        force: true,
      });

      if (!this.productData?.id) return crumbs;

      // 2 звено
      if (this.productData.category?.id) {
        crumbs.push({
          // видимая строка хлебных крошек
          title: this.productData.category.title,
          // код маршрута
          route: 'catalog',
          // параметры маршрутизации
          params: { categoryId: this.productData.category.id },
          // добавить переход по ссылке
          force: true,
        });
      }

      // 3 звено
      crumbs.push({
        title: this.productData.title,
      });

      return crumbs;
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
    colorId() {
      if (!this.product?.colors?.length) return '';
      const color = this.product.colors.find((item) => {
        return item.id === this.color;
      });
      return color?.color.id;
    },
  },
  components: {
    ProductBreadcrumbs,
    BaseCounter,
    SpinnerSpring,
    ProductViewPhotos,
    ColorsSelect,
    SizesSelect,
  },
  methods: {
    ...mapActions(['addProductToCart', 'addNotification']),

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
        apiLoadProduct(this.$route.params.id)
          .then((response) => {
            this.productData = response.data;
          })
          .catch((error) => {
            this.productLoadingErrorCode = error.response.status;
            this.productLoadingFailed = true;
            console.log(error.response.statusText);

            this.$router.push({ name: 'notFound' });

            this.addNotification({
              text:
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? error.response.statusText,
              type: 'error',
            });
          })
          .finally(() => this.stopLoading());
      }, 500);
    },
    changeContentBlock(block) {
      this.contentBlockCurrent = block;
    },
    // + notification (3)
    addToCart() {
      const currentProduct = {
        productId: this.product?.id,
        colorId: this.colorId,
        sizeId: this.size,
        quantity: this.amount,
      };

      // если товар не найден, не запускать axios
      if (!currentProduct.productId) {
        this.addNotification({
          text: 'Товар не найден!',
          type: 'error',
        });
        return;
      }

      this.productAdded = false;
      this.productAdding = true;
      // ! асинхронные функции возвращают промисы!
      this.addProductToCart(currentProduct)
        .then(() => {
          this.productAdded = true;

          this.addNotification({
            text: 'Товар добавлен в корзину',
            type: 'notify',
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.productAdding = false;
        });
    },
  },
  mixins: [functionsMixin],
  watch: {
    product() {
      // здесь нужен наблюдатель, т.к. продукт требует времени для загрузки
      this.color = Number(this.$route.query.color) || this.product.colors[0].id; // цвет берется из параметра маршрутизации
      this.size = this.product.sizes[0].id; // первый доступный размер
    },
    // ! наблюдаем за динамическим сегментом роутера - за его параметрами!
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      immediate: true,
    },

    // -----------------------------------------------------
    color() {
      // сменить параметры запроса в url
      if (this.$route.query.color != this.color) {
        this.$router.replace({
          query: { color: this.color },
        });
      }
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
};
</script>
