<template>
  <div class="spinner" :class="spinnerClass" v-if="visible">
    <slot />
  </div>
</template>

<style lang="sass">
.spinner
  display: flex
  justify-content: center
  margin-top: 10px
  text-align: center
.spinner--tiny
  margin: 0
.spinner--small
  margin-bottom: 10px
.spinner--medium
  margin-bottom: 20px
.spinner--large
  margin-bottom: 35px
.spinner--huge
  margin-bottom: 50px
</style>

<script>
export default {
  name: 'BaseSpinner',
  props: ['visible', 'size'],
  computed: {
    spinnerClass() {
      return `spinner--${this.size}`;
    },
  },
};
</script>
