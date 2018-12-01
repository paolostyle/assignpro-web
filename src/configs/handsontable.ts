import Handsontable from 'handsontable';

export class MaxLengthCellEditor extends Handsontable.editors.NumericEditor {
  createElements() {
    super.createElements();
    this.TEXTAREA.maxLength = 10;
  }
}
