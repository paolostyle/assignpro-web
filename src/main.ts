import Buefy from 'buefy';
import VTooltip from 'v-tooltip';
import Vue from 'vue';
import VueIntro from 'vue-introjs';
import App from './App.vue';
import i18n from './i18n';
import { store } from './store/store';

Vue.use(VueIntro);
Vue.use(VTooltip);
Vue.use(Buefy, {
  defaultDialogCancelText: 'Anuluj',
  defaultNoticeQueue: false
});

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

if (module.hot) {
  module.hot.accept();
}
