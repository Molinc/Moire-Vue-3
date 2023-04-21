<template>
  <li class="dictionary__item">
    <span class="dictionary__key">{{ fieldName }}</span>
    <span class="dictionary__value">{{ fieldValue }}</span>
  </li>
</template>

<script>
export default {
  name: 'BaseDictItem',
  props: ['fieldName', 'fieldValue'],
};
</script>
