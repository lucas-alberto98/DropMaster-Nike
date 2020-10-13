import ArtwalkCalendarService from './artwalk/CalendarService';
import NikeCalendarService from './nike/CalendarService';
import type { Sneaker } from '../types/Sneaker';

export default class CalendarService {
    public static async getProduct(url: string): Promise<Sneaker> {
        const product: Sneaker = await NikeCalendarService.getProduct(url);
        return product;
    }

    public static async getProducts(): Promise<Array<Sneaker>> {
        const products: Array<Sneaker> = await NikeCalendarService.getProducts();
        return products;
    }

    public static async getCalendar(): Promise<Array<Sneaker>> {
        const nikeCalendar: Array<Sneaker> = await NikeCalendarService.getCalendar();
        // const artwalkCalendar: Array<Sneaker> = await ArtwalkCalendarService.getCalendar();
        // return artwalkCalendar.concat(nikeCalendar);
        return nikeCalendar;
    }
}
