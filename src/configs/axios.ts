import axios from 'axios';
import {Helpers} from '../helpers';

export function configureAxios() {
    console.log(process.env);
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.headers['Access-Control-Allow-Origin'] = Helpers.getOrigin();
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
