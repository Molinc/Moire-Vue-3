<template>
  <ul class="breadcrumbs">
    <!-- ! js-способ маршрутизации -->
    <li class="breadcrumbs__item" v-for="crumb in crumbs" :key="crumb.key">
      <!-- делаем без ссылки в случае, если не указан явный переход по клику -->
      <a class="breadcrumbs__link" v-show="!crumb.force">{{ crumb.title }}</a>
      <!-- в противном случае делаем полноценную ссылку -->
      <a
        class="breadcrumbs__link"
        v-show="crumb.force"
        href="#"
        @click.prevent="goto(crumb)"
      >
        {{ crumb.title }}</a
      >
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BaseBreadcrumbs',
  props: ['crumbs'],
  methods: {
    goto(crumb) {
      if (!crumb.force) return;
      this.$router.push({ name: crumb.route, query: crumb.params }); // перевели фильтр на query вместо params
    },
  },
};
</script>
