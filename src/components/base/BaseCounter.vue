<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click="decrease">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input name="count" id="count" v-model.number="count" @input="update" />

    <button type="button" aria-label="Добавить один товар" @click="increase">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'BaseCounter',
  props: ['amount', 'minVal'],
  emits: ['update:amount'],
  data() {
    return {
      count: 1,
    };
  },
  computed: {
    minValue() {
      return parseInt(this.minVal, 10) || 0;
    },
  },
  methods: {
    checkValue(value) {
      if (!value || !parseInt(value, 10)) return this.minValue;
      return Math.max(value, this.minValue);
    },
    update() {
      this.count = this.checkValue(this.count);
      this.onChange();
    },
    increase() {
      this.count = this.checkValue(this.count + 1);
      this.onChange();
    },
    decrease() {
      this.count = this.checkValue(this.count - 1);
      this.onChange();
    },
    onChange() {
      this.$emit('update:amount', this.count);
    },
  },
  watch: {
    amount() {
      // если произошла ошибка изменения числа товара при обращении к серверу, вернуть значение в счетчике обратно
      if (this.amount !== this.count) {
        this.count = this.amount;
      }
    },
  },
  mounted() {
    this.count = this.amount; // сможем задать стартовую величину кол-ва в родительском компоненте
  },
};
</script>
