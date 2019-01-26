<i18n>
  {
    "pl": {
      "calculationType": "Typ obliczeń",
      "actions": "Akcje",
      "solve": "Rozwiąż",
      "duplicate": "Duplikuj zakł.",
      "changeName": "Zmień nazwę",
      "newName": "Podaj nową nazwę:",
      "validationErrors": "Nie można rozwiązać zadania, ponieważ wystąpiły błędy walidacji. Popraw błędy w komórkach: {errorsList} i spróbuj ponownie.",
      "toSimple": "Czy jesteś pewien, że chcesz zmienić typ obliczeń na prosty? Wprowadzone dane numeryczne zostaną zamienione na wartości prawda/fałsz.",
      "toNumeric": "Czy jesteś pewien, że chcesz zmienić typ obliczeń na numeryczny? Wprowadzone dane prawda/fałsz zostaną zamienione na wartości 1/0."
    },
    "en": {
      "calculationType": "Calculation type",
      "actions": "Actions",
      "solve": "Solve",
      "duplicate": "Duplicate tab",
      "changeName": "Change name",
      "newName": "New name:",
      "validationErrors": "Some validation errors occurred. Fix errors in cells: {errorsList} and try again.",
      "toSimple": "Are you sure you want to change calculation type to Simple? Inputted numerical data will be changed to true/false values.",
      "toNumeric": "Are you sure you want to change calculation type to numeric? Inputted true/false values will be changed to 1/0."
    }
  }
</i18n>

<template>
  <section class="config-panel">
    <div class="columns">
      <div class="column">
        <b-field :label="$t('calculationType')">
          <calculation-config-type-picker
            :value="type"
            @change="value => confirmTypeChange(value)"
          />
        </b-field>
        <b-field :label="$t('actions')">
          <p class="control action-buttons">
            <button class="button is-success solve-button" @click="solve()">
              <b-icon icon="calculator"></b-icon>
              <span>{{ $t('solve') }}</span>
            </button>
            <button class="button is-primary is-outlined duplicate-button" @click="cloneTab(id)">
              <b-icon icon="content-duplicate"></b-icon>
              <span>{{ $t('duplicate') }}</span>
            </button>
            <button class="button is-primary is-outlined rename-button" @click="changeTabName()">
              <b-icon icon="rename-box"></b-icon>
              <span>{{ $t('changeName') }}</span>
            </button>
          </p>
        </b-field>
      </div>
      <div class="column"><calculation-result :results="results" /></div>
    </div>
  </section>
</template>

<script lang="ts">
import { SnackbarConfig } from 'buefy/types/components';
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { CalculationResults, CalculationType, Tab, TableCoordinate, TabProperty } from '../types';
import CalculationConfigTypePicker from './CalculationConfigTypePicker.vue';
import CalculationResult from './CalculationResult.vue';

@Component({
  components: { CalculationResult, CalculationConfigTypePicker }
})
export default class CalculationConfig extends Vue {
  @Prop() id: number;
  @Action setTabProperty: (payload: TabProperty) => void;
  @Action sendData: (id: number) => Promise<any>;
  @Action cloneTab: (id: number) => void;
  @Action clearNumericData: (id: number) => void;
  @Action convertBoolsToInts: (id: number) => void;
  @Getter getTab: (id: number) => Tab;
  @Getter getTabResults: (id: number) => CalculationResults;
  @Getter getTabsValidationErrors: (id: number, sorted?: boolean) => TableCoordinate[];
  @Getter tabHasNumericData: (id: number) => boolean;

  get type() {
    return this.getTab(this.id).type;
  }

  set type(value) {
    this.setTabProperty({
      id: this.id,
      property: 'type',
      value
    });
  }

  get results() {
    return this.getTabResults(this.id);
  }

  get isValid() {
    return !this.getTabsValidationErrors(this.id).length;
  }

  // TODO: refactor this method
  confirmTypeChange(newType) {
    if (this.tabHasNumericData(this.id)) {
      if (this.type === CalculationType.Simple && newType !== CalculationType.Simple) {
        this.$dialog.confirm({
          message: this.$i18n.tc('toNumeric'),
          onConfirm: () => {
            this.convertBoolsToInts(this.id);
            this.type = newType;
          }
        });
      } else if (this.type !== CalculationType.Simple && newType === CalculationType.Simple) {
        this.$dialog.confirm({
          message: this.$i18n.tc('toSimple'),
          onConfirm: () => {
            this.clearNumericData(this.id);
            this.type = newType;
          }
        });
      } else {
        this.type = newType;
      }
    } else {
      this.type = newType;
    }
  }

  changeTabName() {
    this.$dialog.prompt({
      message: this.$i18n.tc('newName'),
      confirmText: this.$i18n.tc('change'),
      cancelText: this.$i18n.tc('cancel'),
      inputAttrs: {
        value: this.getTab(this.id).name,
        maxlength: 30
      },
      onConfirm: name =>
        this.setTabProperty({
          id: this.id,
          property: 'name',
          value: name
        })
    });
  }

  solve() {
    if (this.isValid) {
      this.sendData(this.id)
        .then(results => {
          this.$snackbar.open({
            message: this.$i18n.tc(`api_${results.message}`),
            type: 'is-success'
          });
        })
        .catch(({ message }) => {
          this.$snackbar.open({
            message,
            type: 'is-danger'
          });
        });
    } else {
      this.displayValidationErrors();
    }
  }

  private displayValidationErrors() {
    // TODO: probably should move this to Vuex getters
    let errorsList = this.getTabsValidationErrors(this.id)
      .reduce(
        (listOfErrors, error) => {
          listOfErrors.push(`(${error.row}, ${error.col})`);
          return listOfErrors;
        },
        [] as string[]
      )
      .join(', ');

    this.$snackbar.open({
      message: this.$i18n.t('validationErrors', { errorsList }),
      type: 'is-warning',
      indefinite: true
    } as SnackbarConfig);
  }
}
</script>

<style lang="scss" scoped>
.config-panel {
  padding: 1rem 0;
}

.action-buttons > button {
  margin-right: 0.25rem;
}
</style>
