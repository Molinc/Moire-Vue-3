<template>
  <div class="item__pics pics">
    <div class="pics__wrapper" :style="{ height: mainPhotoHeight }">
      <img
        :src="photo"
        :alt="title || 'Фото'"
        class="pics__main"
        :style="{ height: mainPhotoHeight }"
      />
    </div>
    <ul class="pics__list" v-if="showGallery">
      <li class="pics__item" v-for="photo in photos" :key="photo.id">
        <a
          href="#"
          class="pics__link"
          :class="{
            'pics__link--current': photo.isCurrent,
          }"
          @click.prevent="changeProductImage(photo.id)"
        >
          <img :src="photo.photo" :alt="title" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style lang="sass">
.pics
  overflow: hidden
.pics__wrapper
  overflow: hidden
  &:last-child
    margin-bottom: 0
.pics__main
  width: 100%
  object-fit: cover
</style>

<script>
import defaultImageSrc from '@/assets/no-photo.jpg';

export default {
  name: 'ProductViewPhotos',
  props: [
    'photos',
    'photoId',
    'title',
    'galleryVisible',
    'mainPhotoWidth',
    'mainPhotoHeight',
  ],
  emits: ['update:photoId'],
  computed: {
    photo: {
      get() {
        return (
          this.photos.find((item) => item.id === this.photoId)?.photo ||
          defaultImageSrc
        );
      },
      set(value) {
        this.$emit('update:photoId', value);
      },
    },
    showGallery() {
      return this.galleryVisible ?? true;
    },
    getMainPhotoSizes() {
      let width = Number(this.mainPhotoWidth);
      if (Number.isNaN(width)) width = 570;
      let height = Number(this.mainPhotoHeight);
      if (Number.isNaN(height)) height = 570;

      return { width, height };
    },
  },
  methods: {
    changeProductImage(photo) {
      this.photo = photo;
    },
  },
};
</script>
