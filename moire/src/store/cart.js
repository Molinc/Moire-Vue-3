import { colors, errors } from '@/mixins/dictsMixin';
import {
  apiAddProductToCart,
  apiDeleteCartProduct,
  apiUpdateCartProductAmount,
  apiLoadCart,
} from '@/api/api';

export const moduleCart = {
  state: () => ({
    cartProducts: [],
    cartProductsData: [], // содержимое корзины из БД
    cartLoading: false,
    cartLoadingFailed: false,
  }),
  getters: {
    cartLoading(state) {
      return state.cartLoading;
    },
    cartLoadingFailed(state) {
      return state.cartLoadingFailed;
    },
    cartProducts(state) {
      return state.cartProducts;
    },
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find(
          (dataItem) => dataItem.product.id === item.productId,
        );
        // найти цвет, т.к. для некоторых товаров может не быть галереи, нужно будет проверить
        const color = product.colors.find(
          (colorItem) => colorItem.color.id === item.colorId,
        );
        return {
          ...item,
          image: color.gallery?.length ? color.gallery[0].file.url : '',
          color: color.color.title,
          colorCode: color.color.code,
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce(
        (price, item) => price + item.product.price * item.amount,
        0,
      );
    },
    cartProductsCount(state) {
      return state.cartProducts.length;
    },
    cartProductsItemsCount(state) {
      return state.cartProducts.reduce((sum, item) => sum + item.amount, 0);
    },
  },
  mutations: {
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },

    updateCartProductAmount(state, { id, amount }) {
      const product = state.cartProducts.find((item) => item.id === id);
      if (product) {
        product.amount = amount;
      }
    },

    deleteCartProduct(state, id) {
      state.cartProducts = state.cartProducts.filter((item) => item.id !== id);
    },

    updateCartProductsData(state, items) {
      state.cartProductsData = items;
    },

    // синхронизировать содержимое из базы с содержимым из локального хранилища (для последующего внесения изменений)
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        id: item.id,
        productId: item.product.id,
        colorId: item.color.color.id,
        colorCaption: colors.find((color) => color.id === item.color.color.id)
          ?.title,
        sizeId: item.size.id,
        sizeCaption: item.size.title,
        amount: item.quantity,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          colors: item.product.colors,
        },
      }));
    },

    updateCartLoading(state, value) {
      state.cartLoading = value;
    },

    updateCartLoadingFailed(state, value) {
      state.cartLoadingFailed = value;
    },
  },
  actions: {
    loadCart(context) {
      context.commit('updateCartLoading', true);
      context.commit('updateCartLoadingFailed', false);

      setTimeout(() => {
        apiLoadCart({ userAccessKey: context.rootState.config.userAccessKey })
          .then((response) => {
            // ! если ключ в контексте еще не создан либо он не совпадает с возвращенным ключом, обновить ключ контекста для сохранения корзины
            if (
              !context.rootState.config.userAccessKey ||
              context.rootState.config.userAccessKey !==
                response.data.user.accessKey
            ) {
              // создаем и сохраняем в локальном хранилище идентификатор пользователя, только если он у нас в $store еще не сохранялся
              localStorage.setItem(
                'userAccessKey',
                response.data.user.accessKey,
              );
              context.commit(
                'updateUserAccessKey',
                response.data.user.accessKey,
              );

              context.dispatch('addNotification', {
                text: 'Корзина пуста',
                type: 'warning',
              });
            }
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          })
          .catch(() => {
            context.commit('updateCartLoadingFailed', true);
          })
          .finally(() => {
            context.commit('updateCartLoading', false);
          });
      }, 500); // --> для теста
    },

    // + notification
    async addProductToCart(context, { productId, colorId, sizeId, quantity }) {
      context.commit('updateCartLoading', true);
      // ! обязательно возвращаем Promise, чтобы отследить процесс добавления в корзину на странице ProductPage.vue!
      return new Promise((resolve) => setTimeout(resolve, 1000)).then(() =>
        apiAddProductToCart(
          { productId, colorId, sizeId, quantity },
          { userAccessKey: context.rootState.config.userAccessKey },
        )
          .then((response) => {
            context.commit('updateCartProductsData', response.data.items);
            context.commit('syncCartProducts');
          })
          .catch((error) => {
            const res = error?.response;
            const errorObj = res?.data?.error?.request;
            if (!errorObj) return;

            for (let key in errorObj) {
              context.dispatch('addNotification', {
                text: errorObj[key],
                type: 'error',
              });
            }
            throw new Error('Ошибка: ' + error.message);
          })
          .finally(() => {
            context.commit('updateCartLoading', false);
          }),
      );
    },

    // + notification
    async updateCartProductAmount(context, { id, amount }) {
      // ! вызываем изменения в локальном хранилище сразу, чтобы не ждать обновления его из API
      // ! и тем самым сохраняем скорость изменения числа продуктов в корзине при изменении внутри
      context.commit('updateCartProductAmount', { id, amount });

      if (amount < 1) return null;

      return apiUpdateCartProductAmount(
        { basketItemId: id, quantity: amount },
        { userAccessKey: context.rootState.config.userAccessKey },
      )
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch((error) => {
          // ! синхронизацию делаем только в случае ошибок - откат в случае ошибки при ответе сервера
          context.commit('syncCartProducts');

          context.dispatch('addNotification', {
            text:
              errors.find((item) => item.code === error.response.status)
                ?.caption || error.response.statusText,
            type: 'error',
          });
        })
        .finally(() => {});
    },

    // + notification
    async deleteCartProduct(context, id) {
      context.commit('deleteCartProduct', id); // сразу вносим изменения в интерфейс, не дожидаясь апдейта БД

      return apiDeleteCartProduct(
        { basketItemId: id },
        { userAccessKey: context.rootState.config.userAccessKey },
      )
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items); // в случае успеха перевыгружаем данные в productsData из БД
        })
        .catch((error) => {
          console.log(error);
          context.commit('syncCartProducts'); // откатываем изменения в интерфейсе при ошибке апдейта данных в БД

          context.dispatch('addNotification', {
            text:
              errors.find((item) => item.code === error.response.status)
                ?.caption || error.response.statusText,
            type: 'error',
          });
          throw new Error('Ошибка: ' + error.message);
        })
        .finally(() => {});
    },
  },
};
