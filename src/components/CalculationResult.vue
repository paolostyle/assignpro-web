<template>
    <b-field :label="fieldTitle">
        <section class="results">
            <div v-if="hasResults">
                <strong>{{numResultText}}</strong>: {{results.numResult}}
                <b-table default-sort="task"
                         default-sort-direction="asc"
                         :data="results.assignment"
                         :paginated="true"
                         :perPage="5">
                    <template slot-scope="scope">
                        <b-table-column field="task"
                                        label="Zadanie"
                                        sortable
                                        centered>
                            {{ scope.row.task }}
                        </b-table-column>

                        <b-table-column field="worker"
                                        label="Pracownik"
                                        sortable
                                        centered>
                            {{ scope.row.worker }}
                        </b-table-column>

                        <b-table-column field="value"
                                        label="Wartość"
                                        sortable
                                        :visible="results.type !== 4">
                            {{ scope.row.value }}
                        </b-table-column>
                    </template>
                </b-table>
            </div>
            <ap-warning-block v-else>
                Nie wykonano jeszcze żadnych obliczeń.
            </ap-warning-block>
        </section>
    </b-field>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {CalculationResults, CalculationType} from '../types';
    import ApWarningBlock from './ApWarningBlock.vue';

    @Component({
        components: {ApWarningBlock}
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
            return this.results.upToDate === false
                ? 'Wyniki (nieaktualne)'
                : this.localeCalcDate ? `Wyniki (${this.localeCalcDate})` : 'Wyniki';
        }

        get numResultText() {
            switch (this.results.type) {
                case CalculationType.Simple:
                    return 'Przydzielonych zadań';
                case CalculationType.Bottleneck:
                    return 'Wartość progowa';
                default:
                    return 'Suma';
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
