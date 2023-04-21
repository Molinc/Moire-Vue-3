<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="item in deliveries" :key="item.id">
      <label class="options__label" :for="`delivery-item-${item.id}`">
        <input
          class="options__radio sr-only"
          type="radio"
          name="delivery"
          :id="`delivery-item-${item.id}`"
          :value="item.id"
          v-model="currentDeliveryId"
        />
        <span class="options__value">
          {{ item.altCaption }}
          <b>{{ item.caption.toLocaleLowerCase() }}</b>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
import { apiLoadDeliveries } from '@/api/api.js';
import functionsMixin from '@/mixins/functionsMixin';
import { errors } from '@/mixins/dictsMixin';
import { mapActions } from 'vuex';

export default {
  name: 'DeliveriesRadioInputs',
  props: ['delivery'],
  emits: ['change'],
  data() {
    return {
      deliveries: [],
    };
  },
  computed: {
    currentDeliveryId: {
      get() {
        return this.delivery?.id;
      },
      set(value) {
        const currentDelivery = this.deliveries?.find(
          (item) => item.id === value,
        );
        this.$emit('change', currentDelivery);
      },
    },
  },
  methods: {
    ...mapActions(['addNotification']),

    loadDeliveries() {
      apiLoadDeliveries()
        .then((response) => {
          const items = response.data;
          if (!items.length) return;
          this.deliveries = items.map((item) => {
            return {
              id: item.id,
              price: item.price,
              caption: this.deliveryFormat(item),
              altCaption: item.id === 1 ? item.title : 'Курьером',
            };
          });
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки вариантов доставки: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
  },
  watch: {
    deliveries() {
      // выставить вариант доставки по умолчанию
      if (!this.currentDeliveryId) {
        this.currentDeliveryId = this.deliveries[0].id;
      }
    },
  },
  mixins: [functionsMixin],
  created() {
    this.loadDeliveries();
  },
};
</script>
