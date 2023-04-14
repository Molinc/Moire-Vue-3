<template>
  <BaseSpinner :visible="visible" :size="size">
    <SpringSpinner
      :animation-duration="spinnerDuration"
      :size="springSize"
      :color="spinnerColor"
    />
  </BaseSpinner>
</template>

<script>
import baseSpinnerMixin from '@/mixins/baseSpinnerMixin';
import { SpringSpinner } from 'epic-spinners';

export default {
  name: 'SpinnerRhombuses',
  data() {
    return {
      springSizes: { tiny: 8, small: 16, medium: 32, large: 44, huge: 60 },
    };
  },
  computed: {
    springSize() {
      return this.springSizes[this.size];
    },
  },
  components: { SpringSpinner },
  mixins: [baseSpinnerMixin],
};
</script>
