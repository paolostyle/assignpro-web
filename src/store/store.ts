import Vue from 'vue';
import Vuex from 'vuex';
import { Helpers as H } from '../helpers';
import { AppState, CalculatedTab, Tab } from '../types';
import { storeActions as actions } from './actions';
import { storeGetters as getters } from './getters';
import { storeMutations as mutations } from './mutations';

Vue.use(Vuex);

const state: AppState = {
  activeTab: 1,
  tabCounter: 2,
  spinnerActive: false,
  tabs: [H.emptyTab(1, 'Obliczenia 1')] as Tab[],
  history: [] as CalculatedTab[],
  historyCounter: 1,
  user: null
};

export const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

if (module.hot) {
  module.hot.accept(['./mutations', './actions', './getters'], () => {
    store.hotUpdate({
      mutations: require('./mutations').storeMutations,
      actions: require('./actions').storeActions,
      getters: require('./getters').storeGetters
    });
  });
}
