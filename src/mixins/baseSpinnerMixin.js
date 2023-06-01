import BaseSpinner from '@/components/base/spinners/BaseSpinner';

export default {
  name: 'baseSpinnerMixin',
  props: ['visible', 'size', 'color'],
  data() {
    return {
      spinnerDuration: 2000,
      defaultColor: '#e02d71',
    };
  },
  computed: {
    spinnerColor() {
      return this.color ?? this.defaultColor;
    },
  },
  components: { BaseSpinner },
};
