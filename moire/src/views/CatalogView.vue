<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">
          {{ countProductsString(countProducts) }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:material-ids="filterMaterialIds"
        v-model:season-ids="filterSeasonIds"
        v-model:color-ids="filterColorIds"
        v-model:page="page"
        @submit="updateUrlParams('submit')"
        @reset="updateUrlParams('reset')"
      />

      <section class="catalog">
        <PageProductsSelect v-model="productsPerPage" />

        <SpinnerSpring :visible="productsLoading" size="large" />

        <ProductList :products="products" />

        <BasePagination v-model:page="page" :pages="countPages" />
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/products/ProductList.vue';
import BasePagination from '@/components/base/BasePagination.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import PageProductsSelect from '@/components/products/selects/PageProductsSelect.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import { errors } from '@/mixins/dictsMixin.js';
import { mapGetters, mapActions } from 'vuex';
import { apiLoadProducts } from '@/api/api.js';
import functions from '@/mixins/functionsMixin';

export default {
  name: 'CatalogView',
  data() {
    return {
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
      productsLoadingErrorCode: null,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: this.$route.query.categoryId || 0, // TODO! проверить вхождение параметра в список доступных категорий!!!
      filterMaterialIds: [],
      filterSeasonIds: [],
      filterColorIds: [],
      page: 1,
    };
  },
  computed: {
    ...mapGetters({
      productsPerPageSaved: 'productsPerPageSaved',
      cartProducts: 'cartProducts',
    }),

    products() {
      // при первой отрисовке ничего не выведется, т.к. загрузка занимает время, поэтому возвращаем поначалу пустой массив,
      // а уже после загрузки он снова перерисуется в список товаров
      return (this.productsData?.items ?? []).map((item) => {
        const product = {
          ...item,
          // ! -----> наличие продукта разных цветов и размеров в корзине
          itemsAdded: this.cartProductItems(item.id),
        };
        return product;
      });
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    countPages() {
      return this.productsData?.pagination?.pages ?? 1;
    },
    productsPerPage: {
      get() {
        return this.productsPerPageSaved;
      },
      set(value) {
        // console.log(`новое значение productsPerPage = ${value}`);
        this.$store.commit('saveProductsPerPage', value);
      },
    },
  },
  methods: {
    ...mapActions(['addNotification']),

    updateUrlParams(operation) {
      if (operation === 'reset') {
        this.$router.replace({ query: {} });
        return;
      }

      // обновить параметры запроса в url
      let paramsChanged = false;
      const queryNew = {};
      // ------------------------------------------------------------

      // проверка изменения категории
      if (this.$route.query.categoryId != this.filterCategoryId) {
        paramsChanged = true;
        if (this.filterCategoryId) queryNew.categoryId = this.filterCategoryId;
      }
      // аналогично можно сделать проверки и по всем остальным фильтрам ...

      // ------------------------------------------------------------
      if (paramsChanged) this.$router.replace({ query: queryNew });
    },

    cartProductItems(productId) {
      let items =
        this.cartProducts?.filter((item) => {
          return item.productId === productId;
        }) ?? [];

      if (!items?.length) return [];

      items = items.map((item) => {
        return {
          productId: item.productId,
          colorId: item.colorId,
          sizeId: item.sizeId,
          quantity: item.amount,
        };
      });

      return items;
    },
    startLoading() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
    },
    stopLoading() {
      this.productsLoading = false;
    },
    // + notification
    loadProducts(forcePage) {
      this.startLoading();
      // таймер для того, чтобы при изменении фильтров не вызывалась загрузка несколько раз подряд
      this.loadProductsTimer = setTimeout(() => {
        apiLoadProducts({
          minPrice: this.filterPriceFrom,
          maxPrice: this.filterPriceTo,
          categoryId: this.filterCategoryId,
          materialIds: this.filterMaterialIds,
          seasonIds: this.filterSeasonIds,
          colorIds: this.filterColorIds,
          page: forcePage ?? this.page,
          limit: this.productsPerPage,
        })
          .then((response) => {
            this.productsData = response.data;
          })
          .catch((error) => {
            this.productsLoadingErrorCode = error.response.status;
            this.productsLoadingFailed = true;
            console.log(error.response.statusText);

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
  },
  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    PageProductsSelect,
    SpinnerSpring,
  },
  mixins: [functions],
  watch: {
    filterPriceFrom(val, oldVal) {
      this.loadProducts();

      console.log('изменилась "цена от" c ' + oldVal + ' на ' + val); // логирование
    },
    filterPriceTo(val, oldVal) {
      this.loadProducts();

      console.log('изменилась "цена по" c ' + oldVal + ' на ' + val); // логирование
    },
    filterCategoryId(val, oldVal) {
      this.loadProducts();

      console.log('изменилась категория c ' + oldVal + ' на ' + val); // логирование
    },
    filterMaterialIds: {
      handler(val, oldVal) {
        this.loadProducts();

        console.log(
          'изменились материалы с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        ); // логирование
      },
      deep: true,
    },
    filterSeasonIds: {
      handler(val, oldVal) {
        this.loadProducts();

        console.log(
          'изменились сезоны с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        ); // логирование
      },
      deep: true,
    },
    filterColorIds: {
      handler(val, oldVal) {
        this.loadProducts();

        console.log(
          'изменились цвета с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        ); // логирование
      },
      deep: true,
    },
    page(val, oldVal) {
      this.loadProducts();

      console.log(
        'изменился номер текущей страницы c ' + oldVal + ' на ' + val,
      ); // логирование
    },
    productsPerPage(val, oldVal) {
      if (this.page === 1) {
        // если уже выбрана 1 стр, просто перезагружаем список
        this.loadProducts();
      } else {
        // иначе просто меняем страницу (список перезагрузится)
        this.page = 1;
      }

      console.log(
        'изменилось число продуктов на страницу с ' + oldVal + ' на ' + val,
      ); // логирование
    },
  },
  mounted() {
    this.loadProducts();
  },
};
</script>
