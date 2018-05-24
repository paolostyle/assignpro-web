import './configs/polyfills';
import Vue from 'vue';
import Buefy from 'buefy';
import VTooltip from 'v-tooltip';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {firebaseConfig} from './configs/firebase';
import {configureAxios} from './configs/axios';
import {store} from './store';
import App from './App.vue';

Vue.use(VTooltip);
Vue.use(Buefy, {
    defaultDialogCancelText: 'Anuluj',
    defaultNoticeQueue: false
});

const app = new Vue({
    store,
    beforeCreate() {
        configureAxios();
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().onAuthStateChanged(user => {
            user ? this.$store.dispatch('logIn', user) : this.$store.commit('switchSpinner', false);
        });
    },
    render: h => h(App)
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
