<template>
  <div>
    <ul class="cart__orders">
      <li class="cart__order" v-for="item in cartInfo" :key="item.id">
        <h3>{{ item.product.title }}</h3>
        <div>
          <b
            >{{
              numberFormat(item.product.price * (item.quantity || item.amount))
            }}
            ₽</b
          ><br />{{ item.quantity || item.amount }} шт.
        </div>
        <span>Артикул: {{ item.product.id }}</span>
      </li>
    </ul>

    <div class="cart__total">
      <p>
        Доставка: <b>{{ delivery }}</b>
      </p>
      <p>
        Итого: <b>{{ countProductsString(productsCount) }}</b> на сумму
        <b>{{ numberFormat(totalPrice) }} ₽</b>
      </p>
    </div>
  </div>
</template>

<script>
import functionsMixin from '@/mixins/functionsMixin';

export default {
  name: 'CartContentList',
  components: {},
  props: ['cartInfo', 'delivery'],
  model: {},
  data() {
    return {};
  },
  computed: {
    productsCount() {
      return this.cartInfo.length;
    },
    totalPrice() {
      return this.cartInfo.reduce(
        (sum, item) =>
          sum + item.product.price * (item.quantity || item.amount),
        0,
      );
    },
  },
  mixins: [functionsMixin],
};
</script>
