<i18n>
    {
        "pl": {
            "calculationType": "Typ obliczeń",
            "actions": "Akcje",
            "solve": "Rozwiąż",
            "duplicate": "Duplikuj",
            "changeName": "Zmień nazwę",
            "newName": "Podaj nową nazwę:",
            "validationErrors": "Nie można rozwiązać zadania, ponieważ wystąpiły błędy walidacji. Popraw błędy w komórkach: {errorsList} i spróbuj ponownie.",
            "toSimple": "Czy jesteś pewien, że chcesz zmienić typ obliczeń na prosty? Wprowadzone dane prawda/fałsz zostaną zamienione na jedynki i zera.",
            "toNumeric": "Czy jesteś pewien, że chcesz zmienić typ obliczeń na numeryczny? Wprowadzone dane numeryczne zostaną utracone i zostaną zamienione na wartości prawda/fałsz."
        }
    }
</i18n>

<template>
    <section class="config-panel">
        <div class="columns">
            <div class="column">
                <b-field :label="$t('calculationType')">
                    <type-picker :value="type"
                                 @change="value => confirmTypeChange(value)">
                    </type-picker>
                </b-field>
                <b-field :label="$t('actions')">
                    <p class="control">
                        <button class="button is-success"
                                @click="solve()">
                            <b-icon icon="calculator"></b-icon>
                            <span>{{ $t('solve') }}</span>
                        </button>
                        <button class="button is-primary is-outlined"
                                @click="cloneTab(id)">
                            <b-icon icon="content-duplicate"></b-icon>
                            <span>{{ $t('duplicate') }}</span>
                        </button>
                        <button class="button is-primary is-outlined"
                                @click="changeTabName()">
                            <b-icon icon="rename-box"></b-icon>
                            <span>{{ $t('changeName') }}</span>
                        </button>
                    </p>
                </b-field>
            </div>
            <div class="column">
                <results-field :results="results">
                </results-field>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {Action, Getter} from 'vuex-class';
    import {CalculationResults, CalculationType, Tab, TableCoordinate, TabProperty} from '../types';
    import TypePicker from './stateless/TypePicker.vue';
    import ResultsField from './stateless/ResultsField.vue';
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
                } else if (
                    this.type !== CalculationType.Simple &&
                    newType === CalculationType.Simple
                ) {
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
                onConfirm: name => this.setTabProperty({
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
            // TODO: probably should move this to Vuex getters
            let errorsList = this.getTabsValidationErrors(this.id)
                .reduce((listOfErrors, error) => {
                    listOfErrors.push(`(${error.row}, ${error.col})`);
                    return listOfErrors;
                }, [] as string[]).join(', ');

            this.$snackbar.open({
                message: this.$i18n.t('validationErrors', {errorsList}),
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
