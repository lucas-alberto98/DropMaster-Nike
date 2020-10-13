import update from 'immutability-helper';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import store from '../store';
import PurchaseService from './PurchaseService';
import LocalStorageService from './LocalStorageService';
import type { Sneaker } from '../types/Sneaker';

export default class ScheduleService {
    public static getAll(): Array<Sneaker> {
        const sneakers: Array<Sneaker> | null = LocalStorageService.get(
            'sneakers'
        );
        if (Array.isArray(sneakers)) return sneakers;

        return [];
    }

    private static setStorage(sneakers: Array<Sneaker>): void {
        LocalStorageService.set(
            'sneakers',
            sneakers.map((sneaker) => ({
                ...sneaker,
                checkout_in_progress: false,
            }))
        );
    }

    public static create(sneaker: Sneaker): void {
        const schedule: Array<Sneaker> = store.getState().schedule;

        sneaker._id = uuid();
        sneaker.created_at = new Date();
        sneaker.updated_at = new Date();
        const log = this.buildLog('created', { success: true });
        sneaker.logs = [log];

        this.setStorage([...schedule, sneaker]);
        store.dispatch({ type: 'ADD_SCHEDULE_ITEM', payload: sneaker });
    }

    public static getOne(id: string): Sneaker | undefined {
        const schedule: Array<Sneaker> = store.getState().schedule;

        const sneaker: Sneaker | undefined = schedule.find(
            (sneaker: Sneaker) => sneaker._id === id
        );
        return sneaker;
    }

    public static update(id: string, data: any): void {
        const schedule: Array<Sneaker> = store.getState().schedule;

        const index: number = schedule.findIndex(
            (sneaker: Sneaker) => sneaker._id === id
        );
        if (index === -1) return;

        const sneaker: Sneaker | undefined = schedule.find(
            (sneaker: Sneaker) => sneaker._id === id
        );

        const payload = update(schedule, {
            [index]: {
                $set: {
                    ...sneaker,
                    ...data,
                },
            },
        });

        store.dispatch({
            type: 'SET_SCHEDULE',
            payload,
        });
    }

    private static buildLog(
        step: 'created' | 'cart' | 'purchase',
        response: any
    ) {
        const log = { _id: uuid(), step, response, created_at: new Date() };
        return log;
    }

    public static createLog(
        id: string,
        step: 'created' | 'cart' | 'purchase',
        response: any
    ): void {
        const sneaker: Sneaker | undefined = this.getOne(id);
        if (sneaker) {
            const schedule: Array<Sneaker> = store.getState().schedule;

            const index: number = schedule.findIndex(
                (sneaker: Sneaker) => sneaker._id === id
            );
            if (index === -1) return;

            const log = this.buildLog(step, response);

            const payload = update(schedule, {
                [index]: {
                    logs: {
                        $unshift: [log],
                    },
                },
            });

            this.setStorage(payload);

            store.dispatch({
                type: 'SET_SCHEDULE',
                payload,
            });
        }
    }

    public static remove(id: string): void {
        const schedule: Array<Sneaker> = store.getState().schedule;

        const index: number = schedule.findIndex(
            (sneaker: Sneaker) => sneaker._id === id
        );
        if (index === -1) return;

        const payload = update(schedule, {
            $splice: [[index, 1]],
        });

        this.setStorage(payload);
        store.dispatch({
            type: 'SET_SCHEDULE',
            payload,
        });
    }

    public static listen() {
        setInterval(() => {
            const schedule: Array<Sneaker> = store.getState().schedule;
            store.dispatch({ type: 'SET_TIME', payload: moment().toDate() });

            schedule.forEach((sneaker: Sneaker) => {
                const shouldPurchase = moment().isBetween(
                    moment(sneaker.release_date),
                    moment(sneaker.release_date).add(1, 'minutes')
                );
                if (shouldPurchase && !sneaker.checkout_in_progress) {
                    PurchaseService.startCheckout(sneaker._id);
                }
            });
        });
    }
}
