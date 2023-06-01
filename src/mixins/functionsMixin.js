export function startScrolling() {
  document.body.style.overflow = 'auto';
}

export function stopScrolling() {
  document.body.style.overflow = 'hidden';
}

export default {
  name: 'functions',
  methods: {
    numberFormat(value) {
      if (!value) return '';

      const result = new Intl.NumberFormat().format(value);

      return Number.isNaN(result) ? '' : result;
    },

    countProductsString(cnt) {
      function inRange(num) {
        return num >= 10 && num <= 20;
      }
      if (inRange(cnt) || inRange(cnt % 100) || inRange(cnt % 1000)) {
        return `${cnt} товаров`;
      }
      const rem = cnt % 10;
      if (rem === 1) {
        return `${cnt} товар`;
      }
      if ([2, 3, 4].includes(rem)) {
        return `${cnt} товара`;
      }
      return `${cnt} товаров`;
    },

    deliveryFormat(deliveryType) {
      // параметр - объект типа доставки { id, title }
      return deliveryType?.id === 1
        ? 'Бесплатно'
        : `${deliveryType?.price || 0} ₽`;
    },
  },
};
