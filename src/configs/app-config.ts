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
            let message = 'Błąd: ' + error.message;

            if (error.response) {
                message = 'Serwer zwrócił błąd: ' + error.response.status;
            } else if (error.request) {
                message = 'Nie otrzymano odpowiedzi z serwera. Spróbuj ponownie.';
            }

            return Promise.reject({message});
        }
    );
}
