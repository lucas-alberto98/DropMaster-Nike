import ApiService from './ApiService';
import store from '../store';
import LocalStorageService from './LocalStorageService';

export default class UserService {
    public static async getMe(accessToken: boolean) {
        LocalStorageService.set('access_token', accessToken);
        const response = await ApiService.call('/users/me', 'GET');
        const data = await response.json();
        store.dispatch({ type: 'SET_USER_DATA', payload: data });
    }
}
