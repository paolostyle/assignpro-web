import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import i18n from '../i18n';

const firebaseConfig = {
  apiKey: 'AIzaSyCQdJpkdWfeJcF5mGlLbRRyJDATiBMd7nQ',
  authDomain: 'firebase.assignpro.ml',
  databaseURL: 'https://assignpro-84859.firebaseio.com',
  projectId: 'assignpro-84859'
};

export function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

export function configureAxios() {
  axios.defaults.baseURL = 'https://api.assignpro.ml';

  axios.interceptors.response.use(
    response => response,
    error => {
      let message = i18n.t('error', { error: i18n.t(`api_${error.message}`) });

      if (error.response) {
        message = i18n.t('serverError', { error: error.response.status });
      } else if (error.request) {
        message = i18n.t('noResponse');
      }

      return Promise.reject({ message });
    }
  );
}
