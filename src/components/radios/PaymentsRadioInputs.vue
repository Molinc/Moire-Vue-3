<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="payment in payments" :key="payment.id">
      <label class="options__label" :for="`payment-item-${payment.id}`">
        <input
          class="options__radio sr-only"
          type="radio"
          name="payment"
          :id="`payment-item-${payment.id}`"
          :value="payment.id"
          v-model="currentPaymentId"
        />
        <span class="options__value"> {{ payment.caption }} </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { apiLoadPayments } from '@/api/api';
import { errors } from '@/mixins/dictsMixin';
import { mapActions } from 'vuex';

export default {
  name: 'PaymentsRadioInputs',
  props: ['paymentId', 'deliveryId'],
  emits: ['update:paymentId'],
  computed: {
    currentPaymentId: {
      get() {
        return this.paymentId || (this.payments?.length && this.payments[0].id);
      },
      set(value) {
        this.$emit('update:paymentId', value);
      },
    },
  },
  data() {
    return {
      payments: [],
    };
  },
  watch: {
    deliveryId() {
      // каждая доставка подразумевает свои способы оплаты
      this.loadPayments();
    },
    payments() {
      // выставить вариант оплаты по умолчанию (из справочника в миксинах)
      // this.paymentId = this.payments[0]?.id;
      this.currentPaymentId = this.payments[0]?.id;
    },
  },
  methods: {
    ...mapActions(['addNotification']),

    loadPayments() {
      apiLoadPayments(this.deliveryId)
        .then((response) => {
          const items = response.data;
          if (!items.length) return;
          this.payments = items.map((item) => {
            return {
              id: item.id,
              caption: item.title,
            };
          });
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки способов оплаты: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
  },
};
</script>
