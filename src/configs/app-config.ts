import axios from 'axios';
import * as firebase from 'firebase';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyCQdJpkdWfeJcF5mGlLbRRyJDATiBMd7nQ',
    authDomain: 'assignpro-84859.firebaseapp.com',
    databaseURL: 'https://assignpro-84859.firebaseio.com',
    projectId: 'assignpro-84859'
};

export function initializeFirebase(authStateChanged: (user) => void) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(authStateChanged);
}

export function configureAxios() {
    if (process.env.NODE_ENV === 'development') {
        axios.defaults.baseURL = 'http://localhost:5000';
    }

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response) {
                return Promise.reject({message: 'Serwer zwrócił błąd: ' + error.response.status});
            } else if (error.request) {
                return Promise.reject({message: 'Nie otrzymano odpowiedzi z serwera. Spróbuj ponownie.'});
            } else {
                return Promise.reject({message: 'Błąd: ' + error.message});
            }
        }
    );
}
