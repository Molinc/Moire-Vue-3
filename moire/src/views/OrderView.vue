<template>
  <main class="content container">
    <div class="content__top">
      <ProductBreadcrumbs :crumbs="breadcrumbsData" />

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" @submit.prevent="order()">
        <div class="cart__field">
          <!-- поля для заполнения -->
          <div class="cart__data">
            <BaseFormText
              title="ФИО"
              placeholder="Введите ваше полное имя"
              type="text"
              pid="order-name"
              :error="formError.name"
              v-model="formData.name"
            />
            <BaseFormText
              title="Адрес доставки"
              placeholder="Введите ваш адрес"
              type="text"
              pid="order-address"
              :error="formError.address"
              v-model="formData.address"
            />
            <BaseFormPhone
              title="Телефон"
              placeholder="Введите ваш телефон"
              type="tel"
              pid="order-phone"
              :error="formError.phone"
              v-model="formData.phone"
            />
            <BaseFormText
              title="Email"
              placeholder="Введите ваш Email"
              type="email"
              pid="order-email"
              :error="formError.email"
              v-model="formData.email"
            />
            <BaseFormTextArea
              title="Комментарий к заказу"
              placeholder="Ваши пожелания"
              pid="order-comments"
              :error="formError.comments"
              v-model="formData.comments"
            />
          </div>

          <!-- доставка и оплата -->
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <!-- ! более полная форма возврата значения -->
            <DeliveriesRadioInputs
              :delivery="delivery"
              @change="updateDelivery"
            />

            <h3 class="cart__title">Оплата</h3>
            <!-- ! сокращенная форма возврата значения -->
            <PaymentsRadioInputs
              v-model:paymentId="paymentId"
              :delivery-id="deliveryId"
            />
          </div>
        </div>

        <div class="cart__block">
          <CartContent :cart-info="products" :delivery="deliveryCaption" />
          <button
            class="cart__button button button--primery button__order-create"
            type="submit"
          >
            <span>
              Оформить заказ
              <SpinnerSpring
                class="spinner spinner--creating-order"
                :visible="orderCreating"
                size="medium"
                color="white"
              />
            </span>
          </button>
          <p v-show="orderCreated" style="text-align: center">
            Заявка отправлена!
          </p>
        </div>

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<style lang="sass">
.button__order-create
  padding-top: 30px
  span
    position: relative
    .spinner--creating-order
      position: absolute
      object-fit: cover
      top: -8px
      right: -44px
      width: 32px
      height: 32px
      margin: 0
</style>

<script>
import ProductBreadcrumbs from '@/components/base/BaseBreadcrumbs.vue';
import BaseFormText from '@/components/base/forms/BaseFormText.vue';
import BaseFormTextArea from '@/components/base/forms/BaseFormTextArea.vue';
import BaseFormPhone from '@/components/base/forms/BaseFormPhone.vue';
import CartContent from '@/components/cart/CartContent.vue';
import { mapGetters, mapActions } from 'vuex';
import DeliveriesRadioInputs from '@/components/radios/DeliveriesRadioInputs.vue';
import PaymentsRadioInputs from '@/components/radios/PaymentsRadioInputs.vue';
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';
import { errors } from '@/mixins/dictsMixin';
import { apiCreateOrder } from '@/api/api.js';

export default {
  name: 'OrderView',
  data() {
    return {
      formError: {},
      formErrorMessage: '',
      formData: {},
      delivery: {},
      paymentId: null,
      orderCreated: false,
      orderCreating: false, // статус загрузки страницы
      orderCreatingFailed: false, // ошибка при загрузке страницы
      orderCreatingError: {},
    };
  },
  computed: {
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
    ...mapGetters({
      products: 'cartDetailProducts',
      totalPrice: 'cartTotalPrice',
      productsCount: 'cartProductsCount',
      userAccessKey: 'userAccessKey',
    }),
    deliveryCaption() {
      return this.delivery.caption;
    },
    deliveryId() {
      return this.delivery.id;
    },
    phoneProcessed() {
      let phone = this.formData.phone ?? '';
      return phone.trim().replace(/[^+\d]/g, '');
    },
  },
  methods: {
    ...mapActions(['addNotification']),

    updateDelivery(value) {
      this.delivery = value;
    },
    startCreating() {
      this.orderCreating = true;
      this.orderCreatingFailed = false;
      clearTimeout(this.createOrderTimer);
    },
    stopCreating() {
      this.orderCreating = false;
    },
    // + notification
    order() {
      this.startCreating();
      this.createOrderTimer = setTimeout(() => {
        const data = {
          ...this.formData,
          phone: this.phoneProcessed,
          deliveryTypeId: this.delivery.id,
          paymentTypeId: this.paymentId,
          userAccessKey: this.userAccessKey, //this.$store.state.config.userAccessKey,
        };

        apiCreateOrder(data)
          .then((response) => {
            this.orderCreated = true;
            this.$store.commit('resetCart');

            // обновить инфо о добавленном заказе в хранилище и перейти на страницу заказа
            this.$store.commit('updateOrderInfo', response.data);

            this.addNotification({
              text: 'Заказ успешно оформлен',
              type: 'notify',
            });

            this.$router.push({
              name: 'orderInfo',
              params: { id: response.data.id },
            });
          })
          .catch((error) => {
            console.log('Ошибка:');
            console.log(error);

            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;

            this.addNotification({
              text:
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? error.response.statusText,
              type: 'error',
            });
          })
          .finally(() => this.stopCreating());
      }, 1000);
    },
  },
  components: {
    ProductBreadcrumbs,
    BaseFormText,
    BaseFormTextArea,
    CartContent,
    DeliveriesRadioInputs,
    PaymentsRadioInputs,
    BaseFormPhone,
    SpinnerSpring,
  },
};
</script>
