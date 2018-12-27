import { omitBy, set, flatten } from 'lodash-es';
import { CalculationType, Tab, TableCoordinate } from './types';

export class Helpers {
  static generateEmptyData(sizeX: number = 5, sizeY: number = 5, value = null) {
    return Array(sizeY)
      .fill(value)
      .map(() => Array(sizeX));
  }

  static detachReference(item: any) {
    return JSON.parse(JSON.stringify(item));
  }

  static emptyTab(id: number, name: string): Tab {
    return {
      id,
      name,
      data: Helpers.generateEmptyData(),
      type: CalculationType.Sum,
      validationErrors: [],
      assignmentMap: [],
      results: {}
    };
  }

  static transformTabData(data, transformation: (el: any) => any = el => el) {
    let rawData = Helpers.detachReference(data);

    rawData.pop();
    rawData[0].pop();

    let lengthY = rawData.length;
    let lengthX = rawData[0].length;

    for (let i = 1; i < lengthY; i++) {
      rawData[i].pop();
      for (let j = 1; j < lengthX; j++) {
        rawData[i][j] = transformation(rawData[i][j]);
      }
    }

    return rawData;
  }

  static prepareDataForSolver(data, type) {
    let rawData: any[][] = Helpers.detachReference(data);
    let tasks: string[] = Helpers.trimArray(rawData[0]);
    let workers: string[] = Helpers.trimArray(rawData.map(row => row[0]));
    let costs = rawData
      .map((row, rowIndex) => {
        if (rowIndex && rowIndex <= workers.length) {
          return row
            .map((el, index) => {
              if (index && index <= tasks.length) {
                if (el || el === 0) {
                  return el;
                } else {
                  return null;
                }
              }
            })
            .filter(el => typeof el !== 'undefined');
        }
      })
      .filter(el => typeof el !== 'undefined');

    return {
      tasks,
      workers,
      costs,
      type
    };
  }

  static trimArray(array: any[]) {
    const len = array.length;
    const start = array.findIndex(el => !!el);
    let end;

    for (let i = len - 1; i >= 0; i--) {
      if (array[i]) {
        end = i + 1;
        break;
      }
    }

    return array.slice(start, end);
  }

  static findDuplicates(array: any[]) {
    const groupedValues = omitBy(
      array.reduce(
        (total, val, idx) => (val ? set(total, val, (total[val] || []).concat([idx])) : total),
        {}
      ),
      (v: any[]) => v.length <= 1
    );

    return flatten(Object.values(groupedValues));
  }

  static detectDuplicates(tasks: string[], workers: string[]) {
    const tasksDuplicates = this.findDuplicates(tasks).map(col => ({ row: 0, col }));
    const workersDuplicates = this.findDuplicates(workers).map(row => ({ row, col: 0 }));
    return tasksDuplicates.concat(workersDuplicates);
  }
}
