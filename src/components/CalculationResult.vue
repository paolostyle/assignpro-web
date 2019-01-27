<i18n>
  {
    "pl": {
      "noResults": "Nie wykonano jeszcze żadnych obliczeń.",
      "results": "Wyniki",
      "resultsWithDate": "Wyniki ({date})",
      "resultsOutdated": "Wyniki (nieaktualne)",
      "numResultSum": "Suma",
      "numResultBottleneck": "Wartość progowa",
      "numResultSimple": "Przydzielonych zadań",
      "tutorialS6": "Tutaj przedstawiony jest odpowiedni przydział dla problemu minimalizacji kosztów. 'Suma' oznacza całkowity koszt naszego remontu."
    },
    "en": {
      "noResults": "No results so far.",
      "results": "Results",
      "resultsWithDate": "Results ({date})",
      "resultsOutdated": "Results (outdated)",
      "numResultSum": "Sum",
      "numResultBottleneck": "Bottleneck cost",
      "numResultSimple": "Assigned tasks",
      "tutorialS6": "This is an assignment that guarantees lowest cost of the renovation, which equals value in 'Sum' field."
    }
  }
</i18n>

<template>
  <b-field :label="fieldTitle">
    <section
      class="results"
      v-intro="$t('tutorialS6')"
      v-intro-step="6"
      v-intro-tooltip-class="'v-intro-500'"
      v-intro-position="'top'"
    >
      <div v-if="hasResults">
        <strong>{{ numResultText }}</strong
        >: {{ results.numResult }}
        <b-table
          default-sort="task"
          default-sort-direction="asc"
          :data="results.assignment"
          :paginated="true"
          :perPage="5"
        >
          <template slot-scope="scope">
            <b-table-column field="task" :label="$t('task')" sortable centered>
              {{ scope.row.task }}
            </b-table-column>

            <b-table-column field="worker" :label="$t('worker')" sortable centered>
              {{ scope.row.worker }}
            </b-table-column>

            <b-table-column
              field="value"
              :label="$t('value')"
              sortable
              :visible="results.type !== 4"
            >
              {{ scope.row.value }}
            </b-table-column>
          </template>
        </b-table>
      </div>
      <ap-warning-block v-else>{{ $t('noResults') }}</ap-warning-block>
    </section>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { CalculationResults, CalculationType } from '../types';
import ApWarningBlock from './ApWarningBlock.vue';

@Component({
  components: { ApWarningBlock }
})
export default class CalculationResult extends Vue {
  @Prop() results: CalculationResults;

  get hasResults() {
    return Object.keys(this.results).length !== 0;
  }

  get textColor() {
    return !this.results.upToDate ? 'has-text-grey-light' : '';
  }

  get fieldTitle() {
    if (this.results.upToDate) {
      if (this.localeCalcDate) {
        return this.$i18n.t('resultsWithDate', {
          date: this.localeCalcDate
        });
      } else {
        return this.$i18n.t('results');
      }
    } else {
      return this.$i18n.t('resultsOutdated');
    }
  }

  get numResultText() {
    switch (this.results.type) {
      case CalculationType.Simple:
        return this.$i18n.t('numResultSimple');
      case CalculationType.Bottleneck:
        return this.$i18n.t('numResultBottleneck');
      default:
        return this.$i18n.t('numResultSum');
    }
  }

  get localeCalcDate() {
    if (this.results.calculationDate) {
      return new Date(this.results.calculationDate).toLocaleString();
    } else {
      return null;
    }
  }
}
</script>
