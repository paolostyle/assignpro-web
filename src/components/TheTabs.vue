<i18n>
    {
        "pl": {
            "no-tabs": "Brak otwartych zakładek. Utwórz nową, używając przycisku ",
            "add-new-tab": "Podaj nazwę nowego obliczenia:",
            "calculation": "Obliczenie {number}"
        }
    }
</i18n>

<template>
  <div class="is-relative">
    <div class="tabs">
      <ul>
        <calculation-tab
          v-for="tab in tabs"
          :key="tab.id"
          :id="tab.id"
          :class="[{ 'is-active': activeTab === tab.id }]"
          @click.native="setActiveTab(tab.id)"
        />
        <li @click="add()">
          <a><i class="mdi mdi-plus"></i></a>
        </li>
      </ul>
    </div>
    <div v-if="activeTab">
      <calculation-matrix :id="activeTab" />
      <calculation-config :id="activeTab" />
    </div>
    <ap-warning-block v-else> {{ $t('no-tabs') }} <i class="mdi mdi-plus"></i>. </ap-warning-block>
    <b-loading :active.sync="spinnerActive" :is-full-page="false"> </b-loading>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, Mutation, State } from 'vuex-class';
import { Tab } from '../types';
import ApWarningBlock from './ApWarningBlock.vue';
import CalculationConfig from './CalculationConfig.vue';
import CalculationMatrix from './CalculationMatrix.vue';
import CalculationTab from './CalculationTab.vue';

@Component({
  components: {
    ApWarningBlock,
    CalculationTab,
    CalculationMatrix,
    CalculationConfig
  }
})
export default class TheTabs extends Vue {
  @State tabs: Tab[];
  @State activeTab: number;
  @State tabCounter: number;
  @State spinnerActive: boolean;
  @Mutation setActiveTab: (id: number) => void;
  @Action addTab: (name: string) => void;

  add() {
    this.$dialog.prompt({
      message: this.$i18n.tc('add-new-tab'),
      confirmText: this.$i18n.tc('add'),
      inputAttrs: {
        value: this.$i18n.t('calculation', {
          number: this.tabCounter
        }),
        maxlength: 30
      },
      onConfirm: name => this.addTab(name)
    });
  }
}
</script>

<style lang="scss" scoped>
.is-relative {
  position: relative;
}
</style>
