import {Tab} from '../types';

export const storeGetters = {
    getTab: state => id => state.tabs.find(tab => tab.id === id),
    getTabIndex: state => id => state.tabs.findIndex(tab => tab.id === id),
    tabHasData: (state, getters) => id => getters.getTab(id).data.some(row => row.some(el => !!el)),
    getTabResults: (state, getters) => id => getters.getTab(id).results,
    tabFromHistoryAlreadyOpen: (state) => historyId => {
        let openedTabIndex = state.tabs.findIndex(tab => tab.historyId === historyId);
        if (openedTabIndex !== -1) {
            return state.tabs[openedTabIndex].id;
        } else {
            return -1;
        }
    },
    tabHasNumericData: (state, getters) => id => {
        return getters.getTab(id).data.some((row, index) => {
            return index ? row.some((el, elIndex) => elIndex ? !!el : false) : false;
        });
    },
    isOptimalAssignment: (state, getters) => (id, row, col) => {
        let tab: Tab = getters.getTab(id);
        return tab.assignmentMap
            .findIndex(assignment => assignment.row === row && assignment.col === col) !== -1;
    },
    getTabTasks: (state, getters) => id => getters.getTab(id).data[0],
    getTabWorkers: (state, getters) => id => getters.getTab(id).data.map(row => row[0]),
    getTabsValidationErrors: (state, getters) => (id, sorted: boolean = true) => {
        let tab = getters.getTab(id);
        if (typeof tab !== 'undefined') {
            if (sorted) {
                return tab.validationErrors.sort((a, b) => {
                    return a.row !== b.row ? a.row - b.row : a.col - b.col;
                });
            } else {
                return tab.validationErrors;
            }
        }
    },
    getDatabasePath: (state) => state.user ? `history/${state.user.uid}` : null
};
