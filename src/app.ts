import Vue from 'vue';
import Buefy from 'buefy';
import VTooltip from 'v-tooltip';
import VueIntro from 'vue-introjs';
import {store} from './store/store';
import App from './App.vue';
import {i18n} from './configs/i18n';

Vue.use(VueIntro);
Vue.use(VTooltip);
Vue.use(Buefy, {
    defaultDialogCancelText: 'Anuluj',
    defaultNoticeQueue: false
});

const app = new Vue({
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');

if (module.hot) {
    module.hot.accept();
}
