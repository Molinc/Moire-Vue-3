<template>
  <aside class="filter">
    <form
      class="filter__form form"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <!-- цены -->
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <InputCurrency name="min-price" v-model="currentPriceFrom" />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <InputCurrency name="max-price" v-model="currentPriceTo" />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <!-- категория -->
      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model="currentCategoryId"
          >
            <option value="0" disabled>Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <!-- материалы -->
      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materials"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :id="material.code"
                :value="material.id"
                v-model="currentMaterialIds"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
        <!-- <span>Выбранные материалы: {{ currentMaterialIds }}</span> -->
      </fieldset>

      <!-- сезоны -->
      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="season in seasons"
            :key="season.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :id="season.code"
                :value="season.id"
                v-model="currentSeasonIds"
              />
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
        <!-- <span>Выбранные сезоны: {{ currentSeasonIds }}</span> -->
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button
        v-if="!isFiltersClear"
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset()"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import {
  apiLoadProductCategories,
  apiLoadProductMaterials,
  apiLoadProductSeasons,
  apiLoadProductColors,
} from '@/api/api.js';
import { mapActions } from 'vuex';
import { errors } from '@/mixins/dictsMixin';
// import { Money3Directive, unformat } from 'v-money3';
import InputCurrency from '../base/BaseInputCurrency.vue';

export default {
  name: 'ProductFilter',
  props: [
    'priceFrom',
    'priceTo',
    'categoryId',
    'materialIds',
    'seasonIds',
    'colorIds',
    'page',
  ],
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentMaterialIds: [],
      currentSeasonIds: [],
      currentColorIds: [],
      categories: [],
      materials: [],
      seasons: [],
      colors: [],

      // priceConfig: {
      //   prefix: '',
      //   suffix: '',
      //   thousands: ' ',
      //   decimal: ',',
      //   precision: 0,
      //   disableNegative: true,
      //   disabled: false,
      //   min: 0,
      //   max: null,
      //   allowBlank: false,
      //   minimumNumberOfCharacters: 0,
      //   shouldRound: true,
      //   focusOnRight: false,
      //   masked: true,
      //   modelModifiers: {
      //     number: false,
      //   },
      // },
    };
  },
  computed: {
    isFiltersClear() {
      return (
        !this.currentPriceFrom &&
        !this.currentPriceTo &&
        !this.currentCategoryId &&
        !this.currentMaterialIds?.length &&
        !this.currentSeasonIds?.length &&
        !this.currentColorIds?.length
      );
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    materialIds(value) {
      this.currentColorId = value;
    },
    seasonIds(value) {
      this.currentColorId = value;
    },
    colorIds(value) {
      this.currentColorId = value;
    },
  },
  methods: {
    ...mapActions(['addNotification']),

    submit() {
      this.$emit(
        'update:priceFrom',
        this.currentPriceFrom,
        // unformat(this.currentPriceFrom, this.priceConfig),
      );
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:materialIds', this.currentMaterialIds);
      this.$emit('update:seasonIds', this.currentSeasonIds);
      this.$emit('update:colorIds', this.currentColorIds);
      this.$emit('update:page', 1); // ! добавил переброс на 1ю страницу
      this.$emit('submit', true);
    },
    reset() {
      this.currentPriceFrom = 0;
      this.currentPriceTo = 0;
      this.currentCategoryId = 0;
      this.currentMaterialIds = [];
      this.currentSeasonIds = [];
      this.currentColorIds = [];
      this.$emit(
        'update:priceFrom',
        this.currentPriceFrom,
        // unformat(this.currentPriceFrom, this.priceConfig),
      );
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:materialIds', this.currentMaterialIds);
      this.$emit('update:seasonIds', this.currentSeasonIds);
      this.$emit('update:colorIds', this.currentColorIds);
      this.$emit('reset', true);
    },
    loadCategories() {
      apiLoadProductCategories()
        .then((response) => {
          const items = response.data?.items;
          if (!items.length) return;
          this.categories = items;
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки списка категорий: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
    loadMaterials() {
      apiLoadProductMaterials()
        .then((response) => {
          const items = response.data?.items;
          if (!items.length) return;
          this.materials = items;
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки списка материалов: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
    loadSeasons() {
      apiLoadProductSeasons()
        .then((response) => {
          const items = response.data?.items;
          if (!items.length) return;
          this.seasons = items;
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки списка коллекций: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
    loadColors() {
      apiLoadProductColors()
        .then((response) => {
          const items = response.data?.items;
          if (!items.length) return;
          this.colors = items;
        })
        .catch((error) => {
          console.log(error);
          const message = error.response?.data?.error?.message;

          this.addNotification({
            text:
              'Ошибка загрузки списка цветов: ' +
                errors.find((item) => item.code == error.response.status)
                  ?.caption ?? message,
            type: 'error',
          });
        });
    },
    toggleMaterial(id) {
      if (this.currentMaterialIds.find((value) => value === id))
        // eslint-disable-next-line prettier/prettier
        this.currentMaterialIds = this.currentMaterialIds.filter(
          (value) => value !== id,
        );
      else {
        this.currentMaterialIds.push(id);
      }
    },
    toggleSeason(id) {
      if (this.currentSeasonIds.find((value) => value === id))
        // eslint-disable-next-line prettier/prettier
        this.currentSeasonIds = this.currentSeasonIds.filter(
          (value) => value !== id,
        );
      else {
        this.currentSeasonIds.push(id);
      }
    },
    toggleColor(id) {
      if (this.currentColorIds.find((value) => value === id))
        // eslint-disable-next-line prettier/prettier
        this.currentColorIds = this.currentColorIds.filter(
          (value) => value !== id,
        );
      else {
        this.currentColorIds.push(id);
      }
    },
  },
  components: { InputCurrency },
  // directives: { money3: Money3Directive },
  created() {
    this.loadCategories();
    this.loadMaterials();
    this.loadSeasons();
    this.loadColors();
  },
  mounted() {
    this.currentPriceFrom = this.priceFrom;
    this.currentPriceTo = this.priceTo;
    this.currentCategoryId = this.categoryId;
    this.currentMaterialIds = this.materialIds;
    this.currentSeasonIds = this.seasonIds;
    this.currentColorIds = this.colorIds;
  },
};
</script>
