import Vuex from 'vuex';
import Vue from 'vue';
import {Helpers as H} from './helpers';
import {AppState, CalculatedTab, Tab} from './types';
import {storeMutations as mutations} from './store/mutations';
import {storeActions as actions} from './store/actions';
import {storeGetters as getters} from './store/getters';

Vue.use(Vuex);

const state: AppState = {
    activeTab: 1,
    tabCounter: 2,
    spinnerActive: false,
    tabs: [H.emptyTab(1, 'Obliczenia 1')] as Tab[],
    history: [] as CalculatedTab[],
    historyCounter: 1,
    user: null,
    userSpinner: true
};

export const store = new Vuex.Store({
    state, mutations, actions, getters
});

if (module.hot) {
    module.hot.accept(['./store/mutations', './store/actions', './store/getters'], () => {
        store.hotUpdate({
            mutations: require('./store/mutations').storeMutations,
            actions: require('./store/actions').storeActions,
            getters: require('./store/getters').storeGetters
        });
    });
}
