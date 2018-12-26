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
  defaultDialogCancelText: i18n.tc('cancel'),
  defaultNoticeQueue: false
});

const app = {
  store,
  i18n,
  render: h => h(App)
};

Object.defineProperty(Vue.prototype, '$locale', {
  get() {
    return app.i18n.locale;
  },
  set(locale) {
    app.i18n.locale = locale;
  }
});

new Vue(app).$mount('#app');

if (module.hot) {
  module.hot.accept();
}
