<template>
  <b-dropdown v-model="activeType" @change="value => valueChanged(value)">
    <button class="button is-primary media" type="button" slot="trigger">
      <ap-type-icon :is-inline="true" :type="activeTypeData.value" />
      <span class="button-text"> {{ activeTypeData.text }} </span>
      <b-icon class="dropdown-icon" icon="menu-down"> </b-icon>
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
  options = [
    {
      text: 'Sumacyjny',
      desc: 'Przydział minimalizujący sumę jednostek',
      value: CalculationType.Sum
    },
    {
      text: 'Sumacyjny (maks.)',
      desc: 'Przydział maksymalizujący sumę jednostek',
      value: CalculationType.SumMax
    },
    {
      text: 'Progowy',
      desc: 'Przydział minimalizujący koszt najdroższego zadania',
      value: CalculationType.Bottleneck
    },
    {
      text: 'Prosty',
      desc: 'Przydział możliwie największej liczby zadań',
      value: CalculationType.Simple
    }
  ];

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
