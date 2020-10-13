export default class LocalStorageService {
    public static set(key: string, payload: any): void {
        window.localStorage.setItem(key, JSON.stringify(payload));
    }

    public static get(key: string): any {
        const payload = window.localStorage.getItem(key) || '';
        if (payload) return JSON.parse(payload);
        return null;
    }
}
