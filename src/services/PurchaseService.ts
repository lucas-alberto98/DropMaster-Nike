import ScheduleService from './ScheduleService';
import LocalStorageService from './LocalStorageService';
import type { Sneaker } from '../types/Sneaker';

const { ipcRenderer } = window.require('electron');

export default class PurchaseService {
    public static async addToCart(item: Sneaker): Promise<any> {
        const arg = { item };

        const response = await ipcRenderer.invoke('add-to-cart', arg);
        ScheduleService.createLog(item._id, 'cart', response);

        return response;
    }

    public static async purchase(item: Sneaker): Promise<any> {
        const arg = {
            item,
            creditCard: {
                id: LocalStorageService.get('selected_card'),
            },
            address: {
                id: LocalStorageService.get('selected_address'),
            },
        };

        const response = await ipcRenderer.invoke('purchase', arg);
        ScheduleService.createLog(item._id, 'purchase', response);

        if (response.success) {
            ScheduleService.update(item._id, { checkout_in_progress: false });
        }

        return response;
    }

    private static recursivePurchase(item: Sneaker): Promise<void> {
        return new Promise((resolve) => {
            const purchase = async () => {
                const sneaker: Sneaker | undefined = ScheduleService.getOne(
                    item._id
                );

                if (sneaker) {
                    await this.purchase(sneaker);
                    if (sneaker.checkout_in_progress) {
                        purchase();
                    } else {
                        return resolve();
                    }
                }
            };

            purchase();
        });
    }

    public static async startCheckout(id: string) {
        const sneaker: Sneaker | undefined = ScheduleService.getOne(id);

        if (sneaker) {
            ScheduleService.update(sneaker._id, {
                checkout_in_progress: true,
            });

            await this.addToCart(sneaker);
            await this.recursivePurchase(sneaker);
        }
    }
}
