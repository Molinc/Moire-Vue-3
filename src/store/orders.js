export const moduleOrders = {
  state: () => ({
    orderInfo: null,
  }),
  getters: {
    orderInfo(state) {
      return state.orderInfo;
    },
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
  },
};
