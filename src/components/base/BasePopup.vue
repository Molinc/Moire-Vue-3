<template>
  <!-- ! модалку размещаем в телепорте на главной странице (см. App.vue в конце) -->
  <teleport to="#teleport-target">
    <div class="popup" ref="popup">
      <div class="popup__wrapper">
        <div class="popup__header">
          <span>Выбор параметров товара</span>
          <span class="popup__header-close" title="Закрыть" @click="cancel"
            ><i class="material-icons">close</i></span
          >
        </div>

        <div class="popup__content">
          <slot></slot>
        </div>

        <div class="popup__footer">
          <button
            class="button button--second popup__btn popup__btn--close"
            @click="cancel"
          >
            Закрыть
          </button>
          <button
            class="button button--primery popup__btn popup__btn--submit"
            @click="submit"
          >
            {{ submitButtonTitle || 'ОК' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="sass">
.popup
  position: fixed
  top: 0
  bottom: 0
  right: 0
  left: 0
  z-index: 99
  display: flex
  justify-content: center
  align-items: center
  background: rgba(51, 51, 51, 0.6)
  &__wrapper
    display: flex
    flex-direction: column
    justify-content: stretch
    align-items: stretch
    padding: 30px
    padding-left: 50px
    background-color: white
    // border: 1px solid #222
    box-shadow: 4px 4px 8px 0px rgba(black, 0.5)
    width: 800px
    // height: 600px
    max-height: 600px
    overflow: auto
  &__header
    flex-grow: 0
    flex-shrink: 0
    display: flex
    justify-content: space-between
    align-items: center
    margin-bottom: 20px
    font-size: 25px
    &-close
      &:hover
        cursor: pointer
  &__content
    flex-grow: 1
    flex-shrink: 1
    display: flex
    justify-content: center
    align-items: flex-start
  &__footer
    flex-grow: 0
    flex-shrink: 0
    display: flex
    justify-content: flex-end
    align-items: stretch
  &__btn
    display: flex
    align-items: center
    justify-content: center
    padding: 15px 15px 12px
    width: 160px
  // &__btn--submit
  //   width: 160px
  &__btn--close
    margin-right: 20px
</style>

<script>
export default {
  name: 'ProductItemPopup',
  props: ['title', 'submitButtonTitle'],
  emits: ['submit', 'cancel'],
  methods: {
    stopScrolling() {
      document.body.style.paddingRight =
        window.innerWidth - document.documentElement.clientWidth + 'px'; // чтобы не происходил визуальный скачок интерфейса
      document.body.style.overflow = 'hidden';
    },
    startScrolling() {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = 'null';
    },
    cancel() {
      this.startScrolling();
      this.$emit('cancel');
    },
    submit() {
      this.startScrolling();
      this.$emit('submit');
    },
  },
  mounted() {
    const context = this;
    context.stopScrolling();
    document.addEventListener('click', (item) => {
      // закрыть модальное окно при клике вне его
      if (item.target === context.$refs['popup']) {
        context.cancel();
      }
    });
  },
};
</script>
