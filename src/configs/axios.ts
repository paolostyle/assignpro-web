import axios from 'axios';
import {Helpers} from '../helpers';

export function configureAxios() {
    let port = process.env.NODE_ENV === 'development' ? ':5000' : '';
    axios.defaults.baseURL = 'http://localhost' + port + '/api';
    axios.defaults.headers['Access-Control-Allow-Origin'] = Helpers.getOrigin();
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
