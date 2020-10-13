import LocalStorageService from './LocalStorageService';

export default class ApiService {
    public static call(
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
        body?: any
    ) {
        const headers: any = {
            'Content-Type': 'application/json',
        };

        const accessToken = LocalStorageService.get('access_token');

        if (accessToken) {
            headers.Authorization = `Bearer ${accessToken}`;
        }

        return fetch('https://api.dropmaster.org' + url, {
            method,
            headers,
            body: JSON.stringify(body),
        });
    }
}
