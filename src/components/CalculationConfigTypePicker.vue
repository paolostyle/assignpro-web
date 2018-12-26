<i18n>
  {
    "pl": {
      "typeSumDesc": "Przydział minimalizujący sumę jednostek",
      "typeSumMaxDesc": "Przydział maksymalizujący sumę jednostek",
      "typeBottleneckDesc": "Przydział minimalizujący koszt najdroższego zadania",
      "typeSimpleDesc": "Przydział możliwie największej liczby zadań"
    },
    "pl": {
      "typeSumDesc": "Minimize sum of costs",
      "typeSumMaxDesc": "Maximize sum of costs",
      "typeBottleneckDesc": "Minimize cost of the most expensive task",
      "typeSimpleDesc": "Maximize number of assigned tasks"
    }
  }
</i18n>

<template>
  <b-dropdown v-model="activeType" @change="value => valueChanged(value)">
    <button class="button is-primary media" type="button" slot="trigger">
      <ap-type-icon :is-inline="true" :type="activeTypeData.value" />
      <span class="button-text"> {{ activeTypeData.text }} </span>
      <b-icon class="dropdown-icon" icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item v-for="option in options" :key="option.value" :value="option.value">
      <div class="media">
        <ap-type-icon :type="option.value" />
        <div class="media-content">
          <h3>{{ option.text }}</h3>
          <small>{{ option.desc }}</small>
        </div>
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { CalculationType } from '../types';
import ApTypeIcon from './ApTypeIcon.vue';

@Component({
  components: { ApTypeIcon }
})
export default class CalculationConfigTypePicker extends Vue {
  @Prop() value: CalculationType;
  activeType: CalculationType = this.value;

  get options() {
    return Object.keys(CalculationType)
      .filter(key => !parseInt(key, 10))
      .map(key => ({
        text: this.$i18n.t(`type${key}`),
        desc: this.$i18n.t(`type${key}Desc`),
        value: CalculationType[key]
      }));
  }

  get activeTypeData() {
    return this.options.find(option => option.value === this.value);
  }

  @Watch('value')
  synchronizeActiveType() {
    this.activeType = this.value;
  }

  @Emit('change')
  valueChanged() {
    return;
  }
}
</script>
