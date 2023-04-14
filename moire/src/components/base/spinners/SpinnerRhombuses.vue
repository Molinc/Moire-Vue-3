<template>
  <BaseSpinner :visible="visible" :size="size">
    <LoopingRhombusesSpinner
      :animation-duration="spinnerDuration"
      :rhombus-size="rhombusSize"
      :color="spinnerColor"
    />
  </BaseSpinner>
</template>

<script>
import baseSpinnerMixin from '@/mixins/baseSpinnerMixin';
import { LoopingRhombusesSpinner } from 'epic-spinners';

export default {
  name: 'SpinnerRhombuses',
  data() {
    return {
      rhombusSizes: { tiny: 5, small: 10, medium: 15, large: 20, huge: 25 },
    };
  },
  computed: {
    rhombusSize() {
      return this.rhombusSizes[this.size];
    },
  },
  components: { LoopingRhombusesSpinner },
  mixins: [baseSpinnerMixin],
};
</script>
