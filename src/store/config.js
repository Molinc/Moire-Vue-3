export const moduleConfig = {
  state: () => ({
    userAccessKey: null, // уникальный ключ пользователя для корзины из БД
    productsPerPageSaved: 9,
  }),
  getters: {
    productsPerPageSaved(state) {
      return state.productsPerPageSaved;
    },
    userAccessKey(state) {
      return state.userAccessKey;
    },
  },
  mutations: {
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },

    // ? число товаров на страницу
    saveProductsPerPage(state, value) {
      if (!Number.isInteger(value)) return;
      state.productsPerPageSaved = Math.max(6, value);
    },
  },
};
