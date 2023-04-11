<template>
  <main class="content container">
    <!-- <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">
          {{ countProducts | countProductsString }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :material-ids.sync="filterMaterialIds"
        :season-ids.sync="filterSeasonIds"
        :color-ids.sync="filterColorIds"
        :page.sync="page"
      />

      <section class="catalog">
        <PageProductsSelect :value.sync="productsPerPage" />

        <Spinner :visible="productsLoading" size="large" />

        <ProductList :products="products" />

        <BasePagination v-model="page" :pages="countPages" />
      </section>
    </div> -->
  </main>
</template>

<script>
// import { countProductsString } from '@/helpers/productCounters';
// import ProductList from '@/components/products/ProductList.vue';
// import BasePagination from '@/components/base/BasePagination.vue';
// import ProductFilter from '@/components/products/ProductFilter.vue';
// import Spinner from '@/components/base/BaseSpinner.vue';
// import { errors } from '@/mixins/dictsMixin.js';
// import PageProductsSelect from '@/components/products/selects/PageProductsSelect.vue';
// import { mapActions, mapGetters } from 'vuex';
// import { apiLoadProducts } from '@/api/api.js';

export default {
  name: 'CatalogView',
  // props: [],
  // data() {
  //   return {
  //     productsData: null,
  //     productsLoading: false, // статус загрузки страницы
  //     productsLoadingFailed: false, // ошибка при загрузке страницы
  //     productsLoadingErrorCode: null,
  //     filterPriceFrom: 0,
  //     filterPriceTo: 0,
  //     filterCategoryId: this.$route.params.categoryId || 0,
  //     filterMaterialIds: [],
  //     filterSeasonIds: [],
  //     filterColorIds: [],
  //     page: 1,
  //   };
  // },
  // computed: {
  //   ...mapGetters(['productsPerPageSaved']),

  //   products() {
  //     // при первой отрисовке ничего не выведется, т.к. загрузка занимает время, поэтому возвращаем поначалу пустой массив,
  //     // а уже после загрузки он снова перерисуется в список товаров
  //     return (this.productsData?.items ?? []).map((item) => {
  //       const product = {
  //         ...item,
  //         // ! -----> наличие продукта разных цветов и размеров в корзине
  //         itemsAdded: this.cartProductItems(item.id),
  //       };
  //       return product;
  //     });
  //   },
  //   countProducts() {
  //     return this.productsData ? this.productsData.pagination.total : 0;
  //   },
  //   countPages() {
  //     return this.productsData?.pagination?.pages ?? 1;
  //   },
  //   productsPerPage: {
  //     get() {
  //       return this.productsPerPageSaved;
  //     },
  //     set(value) {
  //       this.$store.commit('saveProductsPerPage', value);
  //     },
  //   },
  //   ...mapGetters({
  //     cartProducts: 'cartProducts',
  //   }),
  // },
  // methods: {
  //   ...mapActions(['addNotification']),

  //   cartProductItems(productId) {
  //     let items =
  //       this.cartProducts?.filter((item) => {
  //         return item.productId === productId;
  //       }) ?? [];

  //     if (!items?.length) return [];

  //     items = items.map((item) => {
  //       return {
  //         productId: item.productId,
  //         colorId: item.colorId,
  //         sizeId: item.sizeId,
  //         quantity: item.amount,
  //       };
  //     });

  //     return items;
  //   },
  //   startLoading() {
  //     this.productsLoading = true;
  //     this.productsLoadingFailed = false;
  //     clearTimeout(this.loadProductsTimer);
  //   },
  //   stopLoading() {
  //     this.productsLoading = false;
  //   },
  //   // + notification
  //   loadProducts(forcePage) {
  //     this.startLoading();
  //     // таймер для того, чтобы при изменении фильтров не вызывалась загрузка несколько раз подряд
  //     this.loadProductsTimer = setTimeout(() => {
  //       apiLoadProducts({
  //         minPrice: this.filterPriceFrom,
  //         maxPrice: this.filterPriceTo,
  //         categoryId: this.filterCategoryId,
  //         materialIds: this.filterMaterialIds,
  //         seasonIds: this.filterSeasonIds,
  //         colorIds: this.filterColorIds,
  //         page: forcePage ?? this.page,
  //         limit: this.productsPerPage,
  //       })
  //         .then((response) => {
  //           this.productsData = response.data;
  //         })
  //         .catch((error) => {
  //           this.productsLoadingErrorCode = error.response.status;
  //           this.productsLoadingFailed = true;
  //           console.log(error.response.statusText);

  //           this.addNotification({
  //             text:
  //               errors.find((item) => item.code == error.response.status)
  //                 ?.caption ?? error.response.statusText,
  //             type: 'error',
  //           });
  //         })
  //         .finally(() => this.stopLoading());
  //     }, 500);
  //   },
  // },
  // components: {
  //   ProductList,
  //   BasePagination,
  //   ProductFilter,
  //   Spinner,
  //   PageProductsSelect,
  // },
  // watch: {
  //   page() {
  //     this.loadProducts();
  //   },
  //   filterPriceFrom() {
  //     this.loadProducts();
  //   },
  //   filterPriceTo() {
  //     this.loadProducts();
  //   },
  //   filterCategoryId() {
  //     this.loadProducts();
  //   },
  //   filterMaterialIds() {
  //     this.loadProducts();
  //   },
  //   filterSeasonIds() {
  //     this.loadProducts();
  //   },
  //   filterColorIds() {
  //     this.loadProducts();
  //   },
  //   productsPerPage() {
  //     if (this.page === 1) {
  //       // если уже выбрана 1 стр, просто перезагружаем список
  //       this.loadProducts();
  //     } else {
  //       // иначе просто меняем страницу (список перезагрузится)
  //       this.page = 1;
  //     }
  //   },
  // },
  // filters: { countProductsString },
  // mounted() {
  //   this.loadProducts();
  // },
};
</script>
