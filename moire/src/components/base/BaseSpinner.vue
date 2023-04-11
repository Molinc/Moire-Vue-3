<template>
  <div class="spinner" :class="spinnerClass" v-if="visible">
    <Spinner :size="size" line-fg-color="#222" />
  </div>
</template>

<style lang="sass">
.spinner
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
import Spinner from 'vue-simple-spinner';

export default {
  name: 'BaseSpinner',
  props: ['visible', 'size'],
  computed: {
    spinnerClass() {
      return `spinner--${this.size}`;
    },
  },
  components: { Spinner },
};
</script>
