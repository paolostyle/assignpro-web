import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    pl: {
        change: 'Zmień',
        cancel: 'Anuluj',
        ok: 'OK'
    }
};

export const i18n = new VueI18n({
    locale: 'pl',
    messages
});
