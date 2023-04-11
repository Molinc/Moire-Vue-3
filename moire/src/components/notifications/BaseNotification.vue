<template>
  <div class="notification">
    <TransitionGroup
      name="notification-animate"
      class="notification__list"
      tag="div"
    >
      <div
        class="notification__content"
        v-for="message in messages"
        :key="message.id"
        :class="message.type"
      >
        <div class="notification__icon">
          <i class="material-icons" style="font-size: 50px">{{
            messageIcon(message?.type)
          }}</i>
        </div>
        <div v-bind="$attrs" class="notification__text">
          <span>{{ message.text }}</span>
        </div>
        <div class="notification__buttons">
          <button class="button notification__button" v-if="leftButton.length">
            {{ leftButton }}
          </button>
          <button class="button notification__button" v-if="rightButton.length">
            {{ rightButton }}
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="sass">
.notification
  position: fixed
  bottom: 20px
  right: 16px
  z-index: 50
  max-width: 500px
  &__list
    display: flex
    flex-direction: column
    align-items: flex-end
  &__content
    display: flex
    justify-content: space-between
    align-items: center
    padding: 20px
    background-color: rgba(230, 91, 144, 1)
    border-radius: 12px
    height: auto
    min-height: 90px
    color: white
    box-shadow: 4px 4px 8px 0px rgba(101, 28, 56, 0.25)
    &:not(:last-child)
      margin-bottom: 16px
    &.error
      background-color: lighten(red, 20)
    &.notify
      background-color: green
    &.warning
      background-color: orange
  &__icon
    margin-right: 20px
    .material-icons
      vertical-align: middle
  &__text
    &:not(:last-child)
      margin-right: 20px
  &__buttons
    display: flex
    flex-wrap: nowrap
  &__button
    display: flex
    align-items: center
    justify-content: center
    margin: 0
    padding: 12px 15px 10px
    background-color: white
    border: 1px solid #222
    height: 100%
    color: #222
    font-size: 14px
    &:not(:last-child)
      margin-right: 10px
    &:focus, &:hover
      background-color:#150c26
      color: white
// этапы анимации окна
.notification-animate
  &-enter-from // стартовое состояние перед появлением
    transform: translateX(120px)
    opacity: 0
  &-enter-active // анимация процесса появления
    transition: all .6s ease
  &-enter-to // итоговое состояние после появления
    opacity: 1
  &-move // анимация процесса перемещения имеющихся в списке при добавлении нового сообщения в список
    transition: transform .6s ease
  &-leave-from // стартовое состояние перед исчезновением (т.к. процесс исчезания будет уже начат, жестко зададим высоту и прозрачность)
    // height: initial
    opacity: 1
  &-leave-active // анимация процесса исчезновения
    transition: transform .6s ease, opacity .6s, height .6s
  &-leave-to // итоговое состояние после исчезновения
    // height: 0
    transform: translateX(120px)
    opacity: 0
</style>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'BaseNotification',
  props: {
    // аргументы right-button / left-button, TODO: передавать обработчики
    rightButton: {
      type: String,
      default: () => {
        return '';
      },
    },
    leftButton: {
      type: String,
      default: () => {
        return '';
      },
    },
  },
  computed: {
    ...mapGetters(['messages']),
  },
  methods: {
    ...mapActions(['hideNotification']),
    messageIcon(type) {
      switch (type) {
        case 'error':
          return 'cancel';
        case 'notify':
          return 'check_circle';
        case 'warning':
          return 'error_outline';
        default:
          return 'info';
      }
    },
  },
  watch: {
    messages: {
      handler() {
        // отслеживание мутации массива (иначе вызываться не будет)
        this.hideNotification();
      },
      deep: true,
    },
  },
  mounted() {
    this.hideNotification();
  },
};
</script>
