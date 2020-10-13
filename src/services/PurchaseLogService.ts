import ApiService from './ApiService';

export default class PurchaseLogService {
    public static async create(
        event: 'add_to_cart' | 'remove_from_cart' | 'purchase',
        body: any
    ): Promise<any> {
        const response = await ApiService.call('/purchases/logs', 'POST', {
            event,
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            const data = await response.json();
            return data;
        }
    }
}
