export const moduleNotifications = {
  state: () => ({
    messages: [],
    messagesTimeout: 4000,
  }),
  getters: {
    // ? уведомления - список
    messages(state) {
      return state.messages;
    },
  },
  mutations: {
    // ? уведомления - мутации добавления/удаления
    addMessage(state, value) {
      state.messages.push(value);
    },

    hideMessage(state) {
      // включить таймер только при наличии хотя бы одного сообщения
      if (!state.messages?.length) return;
      setTimeout(() => {
        state.messages.splice(0, 1); //splice(this.messages.length - 1, 1); -----> убрать последнее, для списка, расположенного вверху страницы
      }, state.messagesTimeout);
    },
  },
  actions: {
    // ? уведомления - добавить/удалить
    addNotification(context, message) {
      if (!message?.text?.length) return;

      context.commit('addMessage', {
        id: Date.now().toLocaleString(),
        text: message?.text,
        type: message?.type,
      });
    },

    hideNotification(context) {
      context.commit('hideMessage');
    },
  },
};
