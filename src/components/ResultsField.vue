<template>
    <b-field :label="fieldTitle">
        <section class="results">
            <div v-if="hasResults" :class="['content', textColor]">
                <p><span class="has-text-weight-bold">Data obliczeń:</span> {{localeCalcDate}}</p>
                <p><span class="has-text-weight-bold">{{numResultText}}:</span> {{results.numResult}}</p>
                <p><span class="has-text-weight-bold">Przydział:</span></p>
                <ul>
                    <li v-for="ass in results.assignment" :key="ass.worker">
                        <span class="has-text-weight-bold">{{ass.task}}</span>: {{ass.worker}} ({{ass.value}} jedn.)
                    </li>
                </ul>
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

    @Component
    export default class ResultsField extends Vue {
        @Prop() results: CalculationResults;

        get hasResults() {
            return Object.keys(this.results).length !== 0;
        }

        get textColor() {
            return !this.results.upToDate ? 'has-text-grey-light' : '';
        }

        get fieldTitle() {
            return this.results.upToDate === false ? 'Wyniki (nieaktualne)' : 'Wyniki';
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
                return 'Obliczenia nie powiodły się.';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .results {
        p {
            margin-bottom: 0.125rem;
        }

        ul {
            margin-top: 0.25rem;
        }
    }
</style>
