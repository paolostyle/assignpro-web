import axios from 'axios';
import firebase from 'firebase/app';
import 'firebase/auth';
import i18n from '../i18n';

const firebaseConfig = {
  apiKey: 'AIzaSyCQdJpkdWfeJcF5mGlLbRRyJDATiBMd7nQ',
  authDomain: 'assignpro-84859.firebaseapp.com',
  databaseURL: 'https://assignpro-84859.firebaseio.com',
  projectId: 'assignpro-84859'
};

export function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

export function configureAxios() {
  if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:5000';
  }

  axios.interceptors.response.use(
    response => response,
    error => {
      let message = i18n.t('error', error.message);

      if (error.response) {
        message = i18n.t('serverError', error.response.status);
      } else if (error.request) {
        message = i18n.t('noResponse');
      }

      return Promise.reject({ message });
    }
  );
}
