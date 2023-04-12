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
      />

      <section class="catalog">
        <PageProductsSelect v-model="productsPerPage" />

        <Spinner :visible="productsLoading" size="large" />

        <!-- <ProductList :products="products" />

        <BasePagination v-model="page" :pages="countPages" /> -->
      </section>
    </div>
  </main>
</template>

<script>
// import ProductList from '@/components/products/ProductList.vue';
// import BasePagination from '@/components/base/BasePagination.vue';
import ProductFilter from '@/components/products/ProductFilter.vue';
import PageProductsSelect from '@/components/products/selects/PageProductsSelect.vue';
import Spinner from '@/components/base/BaseSpinner.vue';
// import { errors } from '@/mixins/dictsMixin.js';
import { mapGetters } from 'vuex'; // ! еще надо mapActions
// import { apiLoadProducts } from '@/api/api.js';
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
      filterCategoryId: this.$route.params.categoryId || 0,
      filterMaterialIds: [],
      filterSeasonIds: [],
      filterColorIds: [],
      page: 1,
    };
  },
  computed: {
    ...mapGetters(['productsPerPageSaved']),

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
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    //   countPages() {
    //     return this.productsData?.pagination?.pages ?? 1;
    //   },
    productsPerPage: {
      get() {
        return this.productsPerPageSaved;
      },
      set(value) {
        // console.log(`новое значение productsPerPage = ${value}`);
        this.$store.commit('saveProductsPerPage', value);
      },
    },
    //   ...mapGetters({
    //     cartProducts: 'cartProducts',
    //   }),
  },
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
  components: {
    //   ProductList,
    //   BasePagination,
    ProductFilter,
    Spinner,
    PageProductsSelect,
  },
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
  mixins: [functions],
  watch: {
    filterPriceFrom(val, oldVal) {
      console.log('изменилась "цена от" c ' + oldVal + ' на ' + val);
    },
    filterPriceTo(val, oldVal) {
      console.log('изменилась "цена по" c ' + oldVal + ' на ' + val);
    },
    filterCategoryId(val, oldVal) {
      console.log('изменилась категория c ' + oldVal + ' на ' + val);
    },
    filterMaterialIds: {
      handler(val, oldVal) {
        console.log(
          'изменились материалы с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        );
      },
      deep: true,
    },
    filterSeasonIds: {
      handler(val, oldVal) {
        console.log(
          'изменились сезоны с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        );
      },
      deep: true,
    },
    filterColorIds: {
      handler(val, oldVal) {
        console.log(
          'изменились цвета с ' +
            JSON.stringify(oldVal) +
            ' на ' +
            JSON.stringify(val),
        );
      },
      deep: true,
    },
    page(val, oldVal) {
      console.log(
        'изменился номер текущей страницы c ' + oldVal + ' на ' + val,
      );
    },
  },
};
</script>
