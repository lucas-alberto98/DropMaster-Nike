import fetch from 'node-fetch';
import moment = require('moment');
import { JSDOM } from 'jsdom';
import type { Sneaker } from '../../types/Sneaker';

export default class CalendarService {
    private static formatDate(date: string): Date {
        return moment(`${date} 10:00:00`, 'DD/MM/YYYY HH:mm:ss').toDate();
    }

    private static async getProduct(url: string): Promise<Sneaker> {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (response.status === 200) {
            const data = await response.text();
            const { window } = new JSDOM(data);
            const { document } = window;

            const name: string = <string>(
                (<HTMLElement>document.querySelector('.name-produto'))
                    .textContent
            );
            const image = (<HTMLImageElement>(
                document.querySelector('.box-banner > a > img')
            )).src;

            const sneaker: Sneaker = {
                name,
                image,
                store: 'artwalk',
                url,
            };

            const releaseDate: string = <string>(
                (<HTMLElement>document.querySelector('.data-lanc')).textContent
            );

            if (releaseDate)
                sneaker.release_date = this.formatDate(releaseDate);

            return sneaker;
        }

        throw new Error('could not get product');
    }

    public static async getCalendar(): Promise<Array<Sneaker>> {
        const response = await fetch(
            'https://www.artwalk.com.br/calendario-sneaker',
            {
                method: 'GET',
            }
        );

        if (response.status === 200) {
            const data = await response.text();
            const { window } = new JSDOM(data);
            const { document } = window;

            const urls: Array<string> = Array.from(
                <NodeListOf<HTMLLinkElement>>(
                    document.querySelectorAll('.box-banner > a')
                )
            ).map(({ href }: HTMLLinkElement) => {
                return `https://www.artwalk.com.br${href}`;
            });

            const sneakers: Array<Sneaker> = await Promise.all(
                urls.map((url: string) => this.getProduct(url))
            );

            return sneakers;
        }

        throw new Error('could not get calendar');
    }
}
