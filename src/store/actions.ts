import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { Helpers as H } from '../helpers';

export const storeActions = {
  addTab({ commit, state }, name) {
    commit('addTab', name);
    commit('setActiveTab', state.tabCounter);
    commit('incrementTabCounter');
  },
  addExistingTab({ commit, getters, state }, tab) {
    let alreadyOpenedTabId = getters.tabFromHistoryAlreadyOpen(tab.historyId);

    if (alreadyOpenedTabId !== -1) {
      commit('setActiveTab', alreadyOpenedTabId);
    } else {
      commit('addExistingTab', tab);
      commit('setActiveTab', state.tabCounter);
      commit('incrementTabCounter');
    }
  },
  closeTab({ commit, getters, state }, id) {
    let index = getters.getTabIndex(id);
    commit('removeTab', index);

    // closed active tab
    if (state.activeTab === id) {
      if (index > 0) {
        // closed non-first tab
        commit('setActiveTab', state.tabs[index - 1].id); // so set to previous tab
      } else if (state.tabs[0]) {
        // there is a new first tab (so closed first tab)
        commit('setActiveTab', state.tabs[0].id); // so set to new first tab
      } else {
        // closed the only tab
        commit('setActiveTab', 0);
      }
    }
  },
  cloneTab({ commit, getters, state }, id) {
    commit('cloneTab', getters.getTabIndex(id));
    commit('setActiveTab', state.tabCounter);
    commit('incrementTabCounter');
  },
  setTabProperty({ commit, getters }, { id, property, value }) {
    commit('setTabProperty', {
      index: getters.getTabIndex(id),
      property,
      value
    });
  },
  updateTabData({ commit, getters }, { id, changes }) {
    commit('updateTabData', {
      index: getters.getTabIndex(id),
      changes
    });
  },
  updateValidationErrors({ commit, getters }, { id, isValid, row, col }) {
    commit('updateValidationErrors', {
      index: getters.getTabIndex(id),
      isValid,
      row,
      col
    });
  },
  sendData({ commit, getters, dispatch }, id) {
    let tab = getters.getTab(id);
    let requestData = H.prepareDataForSolver(tab.data, tab.type);

    commit('setLoadingSpinner', true);
    return axios
      .post('/solve', requestData)
      .then(response => response.data)
      .then(results => {
        commit('setLoadingSpinner', false);
        dispatch('saveResults', { id, results });
        dispatch('saveToHistory', getters.getTab(id));
        return results;
      })
      .catch(error => {
        commit('setLoadingSpinner', false);
        return error;
      });
  },
  saveResults({ commit, getters }, { id, results }) {
    let index = getters.getTabIndex(id);
    commit('saveResultsData', { index, results });
    commit('mapAssignmentResults', index);
  },
  saveToHistory({ commit, dispatch }, tab) {
    let date = new Date().toISOString();
    commit('addToHistory', { tab, date });
    commit('incrementHistoryCounter');
    dispatch('saveHistoryToLocalStorage', date);
    dispatch('saveHistoryToDatabase', date);
  },
  saveHistoryToLocalStorage({ state }, date) {
    window.localStorage.setItem('historyDate', date);
    window.localStorage.setItem('historyCounter', state.historyCounter + '');
    window.localStorage.setItem('history', JSON.stringify(state.history));
  },
  saveHistoryToDatabase({ state, getters }, date) {
    if (state.user) {
      firebase
        .database()
        .ref(getters.getDatabasePath)
        .set({
          historyDate: date,
          historyCounter: state.historyCounter,
          history: state.history
        });
    }
  },
  restoreHistoryFromLocalStorage({ commit }) {
    commit('restoreHistory', {
      history: window.localStorage.getItem('history') || '[]',
      historyCounter: window.localStorage.getItem('historyCounter') || '1'
    });
  },
  clearNumericData({ commit, getters }, id) {
    let tabIndex = getters.getTabIndex(id);
    commit('clearNumericData', tabIndex);
  },
  convertBoolsToInts({ commit, getters }, id) {
    let tabIndex = getters.getTabIndex(id);
    commit('convertBoolsToInts', tabIndex);
  },
  logIn({ dispatch }) {
    firebase.auth().languageCode = 'pl';
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase
          .auth()
          .signInWithPopup(new firebase.auth.GoogleAuthProvider())
          .then(result => {
            dispatch('handleSuccessfulLogin', result.user);
            return result;
          });
      });
  },
  logOut({ commit }) {
    return firebase
      .auth()
      .signOut()
      .then(() => commit('saveUserData', null));
  },
  handleSuccessfulLogin({ commit, dispatch }, user) {
    commit('saveUserData', user);
    dispatch('getRemoteHistory');
  },
  getRemoteHistory({ commit, dispatch, getters }) {
    firebase
      .database()
      .ref(getters.getDatabasePath)
      .once('value')
      .then(snapshot => {
        let localHistoryDate = window.localStorage.getItem('historyDate');
        let serverHistoryDate = snapshot.val() && snapshot.val().historyDate;

        if (localHistoryDate && serverHistoryDate) {
          let dateComparison = Date.parse(localHistoryDate) - Date.parse(serverHistoryDate);

          // if local data is newer, behave as if there was no data on the server
          // if server data is newer, behave as if there was no local data
          // if equal do nothing
          if (dateComparison > 0) {
            serverHistoryDate = null;
          } else if (dateComparison < 0) {
            localHistoryDate = null;
          }
        }

        if (localHistoryDate && !serverHistoryDate) {
          dispatch('saveHistoryToDatabase', localHistoryDate);
        } else if (!localHistoryDate && serverHistoryDate) {
          let serverData = snapshot.val();
          serverData.history.forEach(el => {
            el.validationErrors = [];
          });
          commit('saveHistoryFromServer', serverData);
          dispatch('saveHistoryToLocalStorage', serverHistoryDate);
        }
      });
  }
};
