export const payments = [
  { value: 'card', caption: 'Картой при получении' },
  { value: 'cash', caption: 'Наличными при получении' },
];

export const colors = [
  { id: 20, title: 'Красный' },
  { id: 21, title: 'Синий' },
  { id: 22, title: 'Зеленый ' },
  { id: 23, title: 'Желтый ' },
  { id: 24, title: 'Фиолетовый' },
  { id: 25, title: 'Розовый' },
  { id: 26, title: 'Черный' },
  { id: 27, title: 'Белый' },
];

export const errors = [
  { code: 400, caption: 'Некорректные данные' },
  { code: 404, caption: 'Данные не найдены' },
  { code: 500, caption: 'Внутренняя ошибка сервера' },
];

export const productsPerPageList = [6, 9, 12, 18, 24, 27, 32];

export default {
  data() {
    return { payments, colors };
  },
};
