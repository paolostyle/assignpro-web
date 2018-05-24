<template>
    <section class="config-panel">
        <div class="columns">
            <div class="column">
                <b-field label="Typ obliczeń">
                    <type-picker :value="type"
                                 @change="value => confirmTypeChange(value)">
                    </type-picker>
                </b-field>
                <b-field label="Akcje">
                    <p class="control">
                        <button class="button is-success" @click="errOrSolve()">
                            <b-icon icon="calculator"></b-icon>
                            <span>Rozwiąż</span>
                        </button>
                        <button @click="cloneTab(id)" class="button is-primary is-outlined">
                            <b-icon icon="content-duplicate"></b-icon>
                            <span>Duplikuj</span>
                        </button>
                        <button @click="changeTabName()" class="button is-primary is-outlined">
                            <b-icon icon="rename-box"></b-icon>
                            <span>Zmień nazwę</span>
                        </button>
                    </p>
                </b-field>
            </div>
            <div class="column">
                <results-field :results="results"></results-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import {CalculationResults, CalculationType, Tab, TableCoordinate, TabProperty} from '../types';
    import TypePicker from './TypePicker.vue';
    import ResultsField from './ResultsField.vue';
    import {SnackbarConfig} from 'buefy/types/components';

    @Component({
        components: {ResultsField, TypePicker}
    })
    export default class ConfigPanel extends Vue {
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

        get fromHistory() {
            return this.getTabResults(this.id).upToDate;
        }

        get isValid() {
            return !this.getTabsValidationErrors(this.id).length;
        }

        confirmTypeChange(newType) {
            if (this.tabHasNumericData(this.id)) {
                if (this.type === CalculationType.Simple && newType !== CalculationType.Simple) {
                    this.$dialog.confirm({
                        message: 'Czy jesteś pewien, że chcesz zmienić typ obliczeń na numeryczny? ' +
                        'Wprowadzone dane prawda/fałsz zostaną zamienione na jedynki i zera.',
                        onConfirm: () => {
                            this.convertBoolsToInts(this.id);
                            this.type = newType;
                        }
                    });
                } else if (this.type !== CalculationType.Simple && newType === CalculationType.Simple) {
                    this.$dialog.confirm({
                        message: 'Czy jesteś pewien, że chcesz zmienić typ obliczeń na prosty? ' +
                        'Wprowadzone dane numeryczne zostaną utracone i zostaną zamienione na wartości prawda/fałsz.',
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
                message: 'Podaj nową nazwę:',
                confirmText: 'Zmień',
                cancelText: 'Anuluj',
                inputAttrs: {
                    value: this.getTab(this.id).name,
                    maxlength: 30
                },
                onConfirm: name => this.setTabProperty({
                    id: this.id,
                    property: 'name',
                    value: name
                })
            });
        }

        errOrSolve() {
            if (this.isValid) {
                this.sendData(this.id)
                    .then(results => {
                        this.$snackbar.open({
                            message: results.message,
                            type: 'is-success'
                        });
                    })
                    .catch(error => {
                        this.$snackbar.open({
                            message: error.message,
                            type: 'is-danger'
                        });
                    });
            } else {
                this.displayValidationErrors();
            }
        }

        private displayValidationErrors() {
            let errorsList = this.getTabsValidationErrors(this.id).reduce((listOfErrors, error) => {
                listOfErrors.push(`(${error.row}, ${error.col})`);
                return listOfErrors;
            }, [] as string[]).join(', ');

            this.$snackbar.open({
                message: `Nie można rozwiązać zadania, ponieważ wystąpiły błędy walidacji.
                          Popraw wartości w komórkach: ${errorsList} na numeryczne i spróbuj ponownie.`,
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
</style>
