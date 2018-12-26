<template>
  <div class="matrix-container"><hot-table ref="hot" :id="root" :settings="tableSettings" /></div>
</template>

<script lang="ts">
import HotTable from '@handsontable/vue';
import Handsontable, { GridSettings } from 'handsontable';
import numbro from 'numbro';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import { MaxLengthCellEditor } from '../configs/handsontable';
import { Helpers } from '../helpers';
import { CalculationResults, CalculationType, CellValidation, DataChanges, Tab } from '../types';

@Component({
  components: {
    HotTable
  }
})
export default class CalculationMatrix extends Vue {
  @Prop() id: number;
  @Getter getTab: (id: number) => Tab;
  @Getter isOptimalAssignment: (id, row, col) => boolean;
  @Getter getTabResults: (id) => CalculationResults;
  @Getter getTabTasks: (id) => string[];
  @Getter getTabWorkers: (id) => string[];
  @Action updateTabData: (payload: DataChanges) => void;
  @Action updateValidationErrors: (payload: CellValidation) => void;
  tableSettings: GridSettings;
  root: string;

  created() {
    Handsontable.editors.registerEditor('maxLengthCellEditor', MaxLengthCellEditor);

    this.root = 'hot-' + this.id;
    this.tableSettings = {
      fixedRowsTop: 1,
      fixedColumnsLeft: 1,
      minSpareRows: 1,
      minSpareCols: 1,
      startRows: 5,
      startCols: 5,
      rowHeights: 30,
      autoRowSize: true,
      autoWrapCol: false,
      autoWrapRow: false,
      preventOverflow: 'horizontal',
      className: 'htCenter htMiddle',
      cell: [{ row: 0, col: 0, readOnly: true }],
      data: this.getTab(this.id).data,
      beforeChange: this.getBeforeChangeHook(),
      afterValidate: this.getAfterValidateHook(),
      afterChange: this.getAfterChangeHook(),
      cells: this.getCellsConfig()
    };
  }

  get type() {
    return this.getTab(this.id).type;
  }

  get results() {
    return this.getTabResults(this.id);
  }

  get cornerCell() {
    return `<span class="tasks">${this.$i18n.t('tasks')}</span>
      <span class="workers">${this.$i18n.t('workers')}</span>`;
  }

  @Watch('$locale')
  @Watch('id')
  @Watch('type')
  @Watch('results')
  updateSettings() {
    let hotTable: Handsontable = (this.$refs.hot as any).hotInstance;

    hotTable.updateSettings(
      {
        data: this.getTab(this.id).data,
        cells: this.getCellsConfig()
      },
      true
    );

    hotTable.validateCells(() => void 0);
  }

  private customRenderer() {
    let cornerCellRenderer = td => {
      td.classList.add('corner-cell');
      td.innerHTML = this.cornerCell;
    };

    let customCheckboxRenderer = td => {
      let spanCheck = document.createElement('span');
      spanCheck.classList.add('check');

      let checkboxLabel = td.firstChild;
      checkboxLabel.classList.add('b-checkbox', 'checkbox', 'is-hot-checkbox');
      checkboxLabel.appendChild(spanCheck);
    };

    return (hotInstance, td, row, col, prop, value, cellProps) => {
      const { CheckboxRenderer, NumericRenderer, TextRenderer } = Handsontable.renderers;
      if (row && col) {
        if (this.type === CalculationType.Simple) {
          cellProps.label = {
            position: 'before'
          };
          CheckboxRenderer(hotInstance, td, row, col, prop, value, cellProps);
          customCheckboxRenderer(td);
        } else {
          NumericRenderer(hotInstance, td, row, col, prop, value, cellProps);
        }

        if (this.isOptimalAssignment(this.id, row, col)) {
          td.classList.add('optimal-cell');
        }
      } else {
        TextRenderer(hotInstance, td, row, col, prop, value, cellProps);
        row === col ? cornerCellRenderer(td) : td.classList.add('header-cell');
      }

      return td;
    };
  }

  private getCellsConfig() {
    return (row, col): GridSettings => {
      let config = {
        type: 'text',
        editor: 'text',
        renderer: this.customRenderer()
      };

      if (row && col) {
        if (this.type === CalculationType.Simple) {
          config.type = config.editor = 'checkbox';
        } else {
          config.type = 'numeric';
          config.editor = 'maxLengthCellEditor';
        }
      }

      return config;
    };
  }

  private getAfterValidateHook() {
    return (isValid, value, row, col) => {
      this.updateValidationErrors({
        id: this.id,
        col: col as number,
        isValid,
        row
      });
    };
  }

  private getBeforeChangeHook() {
    return (changes, source) => {
      if (source !== 'loadData') {
        changes.forEach(change => {
          if (change[0] && change[1] && typeof change[3] === 'number') {
            let strValue = numbro(change[3]).format({
              trimMantissa: true,
              mantissa: 2
            });
            change[3] = numbro.unformat(strValue);
          }
        });
      }
    };
  }

  private getAfterChangeHook() {
    return (changes, source) => {
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
            duplicates.forEach(({ col, row }) => {
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
    };
  }
}
</script>

<style lang="scss" scoped>
.matrix-container {
  width: 100%;
}
</style>
