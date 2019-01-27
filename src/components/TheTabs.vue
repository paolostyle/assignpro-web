<i18n>
  {
    "pl": {
      "no-tabs": "Brak otwartych zakładek. Utwórz nową, używając przycisku {0}.",
      "add-new-tab": "Podaj nazwę nowego obliczenia:",
      "calculation": "Obliczenie {number}",
      "tutorialS2": "W tym tutorialu rozwiążemy pierwszy przypadek - minimalizację kosztów. Załóżmy, że Hyzio, Dyzio i Zyzio to złote rączki i każdy z nich może zająć się każdym z tych trzech zadań, ale wszyscy mają inne stawki za wykonanie pracy. Oczywiście chcesz zapłacić jak najmniej za cały remont. Znajdziemy więc przydział, który przydzieli pracowników tak, by zapłacić jak najmniej.<br /><br />Możesz otworzyć nową zakładkę i ponownie uruchomić tutorial lub po prostu przejść do kolejnego kroku.",
      "tutorialS3": "Wprowadź w pierwszym wierszu tabeli nazwy zadań, a w pierwszej kolumnie imiona pracowników. Następnie na przecięciu zadań i pracowników wpisz koszt wykonania zadania. Koszt musi być liczbą całkowitą większą lub równą 0 (0 oznacza, że pracownik wykona to zadanie za darmo). Możesz korzystać ze strzałek na klawiaturze oraz klawiszy Enter i Tab - jak w arkuszu kalkulacyjnym.<br />Po zakończeniu, przejdź do następnego kroku."
    },
    "en": {
      "no-tabs": "No tabs opened. Create one using {0} button.",
      "add-new-tab": "New calculation name:",
      "calculation": "Calculation {number}",
      "tutorialS2": "In this tutorial we will solve the first problem - minimization of total cost of renovation. Let's assume that Huey, Dewey and Louie are really talented and each of them can do any task, but their wages differ. Obviously, you want the cost to be as low as possible. We will find assignment that will guarantee just that.<br /><br />You can open a new tab and restart the tutorial once you're done or just go ahead to the next step.",
      "tutorialS3": "In the first row of the table type in task names and in the first column - workers names. Then in their intersections type in the cost of doing a task by a worker. Cost must be an integer higher or equal 0 (0 means that the worker will do a task for free). You can use arrow keys, Enter and Tab keys - like in a spreadsheet.<br />Once you're done, go to the next step."
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
        <li
          @click="add()"
          v-intro="$t('tutorialS2')"
          v-intro-step="2"
          v-intro-tooltip-class="'v-intro-500'"
          v-intro-position="'auto'"
        >
          <a><i class="mdi mdi-plus"></i></a>
        </li>
      </ul>
    </div>
    <div v-if="activeTab">
      <calculation-matrix
        :id="activeTab"
        v-intro="$t('tutorialS3')"
        v-intro-step="3"
        v-intro-tooltip-class="'v-intro-500'"
        v-intro-position="'auto'"
      />
      <calculation-config :id="activeTab" />
    </div>
    <ap-warning-block v-else>
      <i18n path="no-tabs">
        <i class="mdi mdi-plus"></i>
      </i18n>
    </ap-warning-block>
    <b-loading :active.sync="spinnerActive" :is-full-page="false"></b-loading>
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
  @Mutation setTourStep: (step: number) => void;
  @Mutation setActiveTab: (id: number) => void;
  @Action addTab: (name: string) => void;

  add() {
    this.$intro().exit();
    this.setTourStep(3);
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
