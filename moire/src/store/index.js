import { createStore } from 'vuex';
import { moduleConfig } from './config';
import { moduleNotifications } from './notifications';
import { moduleOrders } from './orders';
import { moduleCart } from './cart';

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    config: moduleConfig,
    notifications: moduleNotifications,
    orders: moduleOrders,
    cart: moduleCart,
  },
});
