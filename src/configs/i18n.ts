import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  pl: {
    change: 'Zmień',
    cancel: 'Anuluj',
    ok: 'OK',
    add: 'Dodaj',
    noResponse: 'Nie otrzymano odpowiedzi z serwera. Spróbuj ponownie.',
    serverError: 'Serwer zwrócił błąd: {{error}}',
    error: 'Błąd: {{error}}',
    tasks: 'Zadania',
    workers: 'Pracownicy'
  }
};

export const i18n = new VueI18n({
  locale: 'pl',
  messages,
  silentTranslationWarn: true
});
