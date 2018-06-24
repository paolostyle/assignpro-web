export enum CalculationType {
    Sum = 1,
    SumMax = 2,
    Bottleneck = 3,
    Simple = 4
}

export interface Payload {
    id: number;
}

export interface AppState {
    spinnerActive: boolean;
    activeTab: number;
    tabCounter: number;
    tabs: Tab[];
    history: CalculatedTab[];
    historyCounter: number;
    user: any;
}

export interface Tab {
    id: number;
    historyId?: number;
    name: string;
    type: CalculationType;
    data: any[][];
    validationErrors: TableCoordinate[];
    assignmentMap: TableCoordinate[];
    results: CalculationResults;
}

export interface CalculatedTab extends Tab {
    date: string;
    formattedDate?: string;
}

export interface TabProperty extends Payload {
    property: string;
    value: any;
}

export interface TableCoordinate {
    row: number;
    col: number;
}

export interface CellValidation extends Payload, TableCoordinate {
    isValid: boolean;
}

export interface DataChanges extends Payload {
    changes: any;
}

export interface CalculationResults {
    type?: CalculationType;
    calculationDate?: string;
    numResult?: number;
    assignment?: Assignment[];
    upToDate?: boolean;
}

export interface Assignment extends TableCoordinate {
    task: string;
    worker: string;
    value: number | boolean;
}
