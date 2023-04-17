<template>
  <button class="button btn-cart btn-cart--add">
    <SpinnerSpring
      class="btn-cart__loading"
      :visible="adding"
      size="small"
      color="white"
    />
    <span
      class="btn-cart__icon"
      :class="{ 'btn-cart__icon--invisible': added || adding }"
    >
      <i class="material-icons-outlined" style="font-size: 25px"
        >add_shopping_cart</i
      >
    </span>
    <span
      class="btn-cart__icon"
      :class="{ 'btn-cart__icon--invisible': !added || adding }"
    >
      <i class="material-icons" style="font-size: 25px">shopping_cart</i>
    </span>
    <!-- <span>В корзину</span> -->
  </button>
</template>

<style lang="sass">
.btn-cart
  display: flex
  align-items: center
  justify-content: center
  align-self: flex-end
  padding: 10px 10px 8px
  background-color: #e02d71
  border-radius: 50%
  // width: 133px
  width: 45px
  height: 45px
  font-size: 14px
  color: white
  &__icon
    display: flex
    align-items: center
    justify-content: center
    // margin-right: 8px
    &--invisible
      display: none
  &__loading
    // margin-right: 8px
    margin-bottom: 11px
  &:focus, &:hover
    background-color: #222
</style>

<script>
import SpinnerSpring from '@/components/base/spinners/SpinnerSpring.vue';

export default {
  name: 'CartAddButton',
  props: ['added', 'adding'],
  components: {
    SpinnerSpring,
  },
};
</script>
