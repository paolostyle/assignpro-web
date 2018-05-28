<template>
    <b-field :label="fieldTitle">
        <section class="results">
            <div v-if="hasResults">
                <strong>{{numResultText}}</strong>: {{results.numResult}}
                <b-table :data="results.assignment"
                         :paginated="true"
                         :perPage="5"
                         default-sort="task"
                         default-sort-direction="asc">
                    <template slot-scope="scope">
                        <b-table-column field="task" label="Zadanie" sortable centered>
                            {{ scope.row.task }}
                        </b-table-column>

                        <b-table-column field="worker" label="Pracownik" sortable centered>
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
            <div v-else>
                <div class="content has-text-grey has-text-centered">
                    <p>
                        <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                        </b-icon>
                    </p>
                    <p>Nie wykonano jeszcze żadnych obliczeń.</p>
                </div>
            </div>
        </section>
    </b-field>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {CalculationResults, CalculationType} from '../types';
    import TypeIcon from './TypeIcon.vue';

    @Component({
        components: {TypeIcon}
    })
    export default class ResultsField extends Vue {
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
