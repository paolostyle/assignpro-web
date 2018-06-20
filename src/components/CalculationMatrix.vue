<template>
    <div class="table-container">
        <hot-table ref="hot"
                   :root="root"
                   :settings="tableSettings"/>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import HotTable from '@handsontable/vue';
    import {Action, Getter} from 'vuex-class';
    import Handsontable, {GridSettings} from 'handsontable';
    import {CalculationResults, CalculationType, CellValidation, DataChanges, Tab} from '../types';
    import {Helpers} from '../helpers';

    @Component({
        components: {
            HotTable
        }
    })
    export default class DataTable extends Vue {
        @Prop() id: number;
        @Getter getTab: (id: number) => Tab;
        @Getter isOptimalAssignment: (id, row, col) => boolean;
        @Getter getTabResults: (id) => CalculationResults;
        @Getter getTabTasks: (id) => string[];
        @Getter getTabWorkers: (id) => string[];
        @Action updateTabData: (payload: DataChanges) => void;
        @Action updateValidationErrors: (payload: CellValidation) => void;
        cellsConfig: (row, col) => object;
        tableSettings: GridSettings;
        root: string;

        created() {
            this.cellsConfig = (row, col) => {
                return {
                    type: row === 0 || col === 0 ? 'text' : (
                        this.type === CalculationType.Simple ? 'checkbox' : 'numeric'
                    ),
                    renderer: this.customRenderer(
                        this.type, this.isOptimalAssignment(this.id, row, col)
                    )
                };
            };

            this.root = 'hot-' + this.id;
            this.tableSettings = {
                fixedRowsTop: 1,
                fixedColumnsLeft: 1,
                minSpareRows: 1,
                minSpareCols: 1,
                preventOverflow: 'horizontal',
                startRows: 5,
                startCols: 5,
                rowHeights: 30,
                autoRowSize: true,
                className: 'htCenter htMiddle',
                cell: [{row: 0, col: 0, readOnly: true}],
                data: this.getTab(this.id).data,
                afterValidate: (isValid, value, row, col) => {
                    this.updateValidationErrors({
                        id: this.id,
                        col: col as number,
                        isValid, row
                    });
                },
                afterChange: (changes, source) => {
                    if (source !== 'loadData') {
                        this.updateTabData({
                            id: this.id,
                            changes
                        });

                        // TODO fix this
                        changes.forEach(change => {
                            if (change[0] === 0 || change[1] === 0) {
                                let duplicates = Helpers.detectDuplicates(
                                    change[3],
                                    this.getTabTasks(this.id),
                                    this.getTabWorkers(this.id)
                                );
                                console.log(duplicates);
                                duplicates.forEach(({col, row}) => {
                                    this.updateValidationErrors({
                                        id: this.id,
                                        isValid: false,
                                        col,
                                        row
                                    });
                                });
                            }
                        });
                    }
                },
                cells: this.cellsConfig
            };
        }

        get type() {
            return this.getTab(this.id).type;
        }

        get results() {
            return this.getTabResults(this.id);
        }

        @Watch('id')
        @Watch('type')
        @Watch('results')
        updateSettings() {
            let hotTable: Handsontable = (this.$refs.hot as any).table;

            hotTable.updateSettings({
                data: this.getTab(this.id).data,
                cells: this.cellsConfig
            }, true);

            hotTable.validateCells(() => void 0);
        }

        customRenderer(type, isValid) {
            return function(hotInstance, td, row, col, prop, value, cellProperties) {
                if (row === 0 || col === 0) {
                    Handsontable.renderers.TextRenderer.apply(null, arguments);

                    td.style.fontWeight = 'bold';
                    td.style.background = '#f5f5f5';

                    if (row === col) {
                        td.classList.add('corner-cell');
                        td.style.background =
                            'linear-gradient(to top right, #f5f5f5 48%, #CCC, #f5f5f5 52%)';
                        td.innerHTML = `<span class="tasks">Zadania</span>
                                        <span class="workers">Pracownicy</span>`;
                    }
                } else {
                    if (type === CalculationType.Simple) {
                        cellProperties.label = {
                            position: 'before'
                        };
                        Handsontable.renderers.CheckboxRenderer.apply(null, arguments);

                        let spanCheck = document.createElement('span');
                        spanCheck.classList.add('check');
                        let checkboxLabel = td.firstChild;
                        checkboxLabel.classList.add('b-checkbox', 'checkbox', 'is-hot-checkbox');
                        checkboxLabel.appendChild(spanCheck);
                    } else {
                        Handsontable.renderers.TextRenderer.apply(null, arguments);
                    }

                    if (row !== 0 && col !== 0 && isValid) {
                        td.style.background = '#23d160';
                    }
                }
            };
        }
    }
</script>

<style lang="scss" scoped>
    .table-container {
        width: 100%;
    }
</style>
