import {Tab, TableCoordinate} from '../types';
import {Helpers as H} from '../helpers';
import {User} from 'firebase';

export const storeMutations = {
    setLoadingSpinner(state, value) {
        state.spinnerActive = value;
    },
    setActiveTab(state, id) {
        state.activeTab = id;
    },
    incrementTabCounter(state) {
        state.tabCounter++;
    },
    addTab(state, name) {
        state.tabs.push(H.emptyTab(state.tabCounter, name));
    },
    removeTab(state, index) {
        state.tabs.splice(index, 1);
    },
    cloneTab(state, index) {
        let original = state.tabs[index];
        let clone: Tab = H.detachReference(original);
        clone.id = state.tabCounter;
        clone.name += ' (kopia)';
        state.tabs.push(clone);
    },
    setTabProperty(state, {index, property, value}) {
        let currentTab = state.tabs[index];

        if (currentTab.historyId) {
            currentTab.historyId = undefined;
            currentTab.results.upToDate = false;
            currentTab.assignmentMap = [];
        }

        currentTab[property] = value;
    },
    updateTabData(state, {index, changes}) {
        let currentTab = state.tabs[index];

        if (currentTab.historyId) {
            currentTab.historyId = undefined;
            currentTab.results.upToDate = false;
            currentTab.assignmentMap = [];
        }

        changes.forEach(change => currentTab.data[change[0]][change[1]] = change[3]);
        state.tabs.splice(index, 1, currentTab);
    },
    updateValidationErrors(state, {index, isValid, row, col}) {
        let errorIndex = state.tabs[index].validationErrors
            .findIndex(error => error.row === row && error.col === col);

        if (errorIndex !== -1) {
            state.tabs[index].validationErrors.splice(errorIndex, 1);
        }

        if (!isValid) {
            state.tabs[index].validationErrors.push({row, col});
        }
    },
    incrementHistoryCounter(state) {
        state.historyCounter++;
    },
    addToHistory(state, {tab, date}) {
        let clone = H.detachReference(tab);
        clone.date = date;
        clone.id = 0;
        clone.historyId = state.historyCounter;
        tab.historyId = state.historyCounter;
        state.history.push(clone);
    },
    restoreHistory(state, {historyCounter, history}: {historyCounter: string, history: string}) {
        state.historyCounter = +historyCounter;
        state.history = JSON.parse(history);
    },
    saveHistoryFromServer(state, {historyCounter, history}) {
        state.historyCounter = historyCounter;
        state.history = history;
    },
    addExistingTab(state, tab) {
        tab = H.detachReference(tab);
        tab.id = state.tabCounter;
        state.tabs.push(tab);
    },
    clearNumericData(state, index) {
        let data = state.tabs[index].data;
        state.tabs[index].data = H.transformTabData(data, el => !!el);
    },
    convertBoolsToInts(state, index) {
        let data = state.tabs[index].data;
        state.tabs[index].data = H.transformTabData(data, el => +el);
    },
    saveResultsData(state, {index, results}) {
        results.upToDate = true;
        state.tabs[index].results = results;
    },
    mapAssignmentResults(state, index) {
        let results = state.tabs[index].results;
        let assignmentMap: TableCoordinate[] = [];
        if (typeof results.assignment !== 'undefined') {
            results.assignment.forEach(({row, col}) => assignmentMap.push({row, col}));
        }
        state.tabs[index].assignmentMap = assignmentMap;
    },
    saveUserData(state, user: User | null) {
        if (user) {
            let {displayName, uid} = user;
            state.user = {
                displayName,
                uid
            };
        } else {
            state.user = null;
        }
    }
};
