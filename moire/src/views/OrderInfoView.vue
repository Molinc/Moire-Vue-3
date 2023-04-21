<template>
  <main class="content container">
    <div class="content__top">
      <ProductBreadcrumbs :crumbs="breadcrumbsData" />

      <SpinnerSpring :visible="orderInfoLoading" size="large" />

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderInfo.id }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <BaseDictItem
              field-name="Получатель"
              :field-value="orderInfo.name"
            />
            <BaseDictItem
              field-name="Адрес доставки"
              :field-value="orderInfo.address"
            />
            <BaseDictItem field-name="Телефон" :field-value="orderInfo.phone" />
            <BaseDictItem field-name="Email" :field-value="orderInfo.email" />
            <BaseDictItem
              field-name="Способ оплаты"
              :field-value="orderInfo.paymentType"
            />
          </ul>
        </div>

        <div class="cart__total">
          <CartContent
            :cartInfo="cartInfo"
            :delivery="deliveryFormat(orderInfo.deliveryType)"
          />
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import ProductBreadcrumbs from '@/components/base/BaseBreadcrumbs.vue';
import CartContent from '@/components/cart/CartContent.vue';
import functionsMixin from '@/mixins/functionsMixin';
import BaseDictItem from '@/components/base/BaseDictItem.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import { apiLoadOrderInfo } from '@/api/api';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { errors } from '@/mixins/dictsMixin';

export default {
  name: 'OrderInfoView',
  data() {
    return {
      orderInfoLoading: false,
      orderInfoLoadingFailed: false,
      orderInfoLoadingErrorCode: null,
    };
  },
  computed: {
    ...mapGetters({
      orderInfoStore: 'orderInfo',
      userAccessKey: 'userAccessKey',
    }),

    breadcrumbsData() {
      return [
        {
          title: 'Каталог',
          route: 'catalog',
          force: true,
        },
        {
          title: 'Корзина',
          route: 'cart',
          force: true,
        },
        {
          title: 'Оформление заказа',
        },
      ];
    },
    orderInfo() {
      return this.orderInfoStore || {}; //this.$store.state.orders.orderInfo || {};
    },
    cartInfo() {
      return this.orderInfo.basket?.items || [];
    },
  },
  components: {
    ProductBreadcrumbs,
    CartContent,
    BaseDictItem,
    SpinnerSpring,
  },
  methods: {
    ...mapActions(['addNotification']),
    ...mapMutations(['updateOrderInfo']),

    startLoading() {
      this.orderInfoLoading = true;
      this.orderInfoLoadingFailed = false;
      clearTimeout(this.loadOrderInfoTimer);
    },
    stopLoading() {
      this.orderInfoLoading = false;
    },
    // + notification
    loadOrderInfo() {
      this.startLoading();
      // таймер для того, чтобы при изменении фильтров не вызывалась загрузка несколько раз подряд
      this.loadOrderInfoTimer = setTimeout(() => {
        apiLoadOrderInfo(this.$route.params.id, {
          userAccessKey: this.userAccessKey,
        })
          .then((response) => {
            this.updateOrderInfo(response.data);
          })
          .catch((error) => {
            console.log(error);

            this.$router.push({ name: 'notFound' });

            this.addNotification({
              text:
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? error.response.statusText,
              type: 'error',
            });
          })
          .finally(() => {
            this.stopLoading();
          });
      }, 500);
    },
  },
  mixins: [functionsMixin],
  created() {
    if (this.orderInfo.id === this.$route.params.id) {
      return; // не выполняем извлечение дважды, т.к. после создания данные уже извлечены в $store
    }
    this.loadOrderInfo();
  },
};
</script>
