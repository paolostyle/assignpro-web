import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import { get } from 'lodash-es';
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
  axios.defaults.baseURL = process.env.VUE_APP_API_URL;

  axios.interceptors.response.use(
    response => response,
    error => {
      let message;

      if (get(error, 'response.data.message') && get(error, 'response.data.calculationDate')) {
        message = i18n.t('error', { error: i18n.t(`api_${error.response.data.message}`) });
      } else if (
        get(error, 'response.data.message') &&
        !get(error, 'response.data.calculationDate')
      ) {
        message = i18n.t('serverError', { error: error.response.status });
      } else {
        message = i18n.t('noResponse');
      }

      return Promise.reject({ message });
    }
  );
}
