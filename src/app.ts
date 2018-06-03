import './configs/polyfills';
import Vue from 'vue';
import Buefy from 'buefy';
import VTooltip from 'v-tooltip';
import VueIntro from 'vue-introjs';
import {initializeFirebase, configureAxios} from './configs/app-config';
import {store} from './store';
import App from './App.vue';

Vue.use(VueIntro);
Vue.use(VTooltip);
Vue.use(Buefy, {
    defaultDialogCancelText: 'Anuluj',
    defaultNoticeQueue: false
});

// introJs().setOptions({
//     nextLabel: 'Dalej',
//     prevLabel: 'Cofnij',
//     doneLabel: 'Gotowe',
//     skipLabel: 'Pomiń'
// });

const app = new Vue({
    store,
    beforeCreate() {
        configureAxios();
        initializeFirebase(user => {
            user
                ? this.$store.dispatch('logIn', user)
                : this.$store.commit('switchSpinner', false);
        });
    },
    render: h => h(App)
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
