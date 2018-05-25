import axios from 'axios';
import {Helpers} from '../helpers';

export function configureAxios() {
    axios.defaults.baseURL = 'http://localhost/api';
    // axios.defaults.headers['Access-Control-Allow-Origin'] = Helpers.getOrigin();
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response) {
                return Promise.reject(error.response.data);
            } else if (error.request) {
                return Promise.reject({message: 'Nie otrzymano odpowiedzi z serwera. Spróbuj ponownie.'});
            } else {
                return Promise.reject({message: 'Błąd: ' + error.message});
            }
        }
    );
}
