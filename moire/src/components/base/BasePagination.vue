<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': isFirstPage }"
        aria-label="Предыдущая страница"
        @click.prevent="paginate(page - 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>

    <li class="pagination__item" v-for="pageNum in pages" :key="pageNum">
      <a
        href="#"
        class="pagination__link"
        :class="{ 'pagination__link--current': pageNum === page }"
        @click.prevent="paginate(pageNum)"
      >
        {{ pageNum }}
      </a>
    </li>

    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{ 'pagination__link--disabled': isLastPage }"
        href="#"
        aria-label="Следующая страница"
        @click.prevent="paginate(page + 1)"
      >
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'BasePagination',
  props: ['page', 'pages'],
  emits: ['update:page'],
  computed: {
    isFirstPage() {
      return this.page === 1;
    },
    isLastPage() {
      return this.page === this.pages;
    },
  },
  methods: {
    paginate(pageTo) {
      if (this.isPageExists(pageTo)) {
        this.$emit('update:page', pageTo);
      }
    },
    isPageExists(num) {
      return num >= 1 && num <= this.pages;
    },
  },
};
</script>
