import moment = require('moment');
import { JSDOM } from 'jsdom';
import Browser from '../../utils/Browser';
import type { Sneaker, Size } from '../../types/Sneaker';

export default class CalendarService {
    private static async getSneaker(sku: string): Promise<any> {
        const page = await Browser.getPage();

        const data: any = await page.evaluate((sku: string) => {
            return new Promise((resolve, reject) => {
                fetch('https://www.nike.com.br/ProductLookup/' + sku, {
                    method: 'GET',
                }).then((response) => {
                    if (response.status === 200) {
                        response.json().then((data: string) => {
                            resolve(data);
                        });
                    } else {
                        reject();
                    }
                });
            });
        }, sku);

        const [sneaker] = data;

        return sneaker;
    }

    private static async getSneakerPage(url: string): Promise<any> {
        const page = await Browser.getPage();

        const data: any = await page.evaluate((url: string) => {
            return new Promise((resolve, reject) => {
                fetch(url, {
                    method: 'GET',
                }).then((response) => {
                    if (response.status === 200) {
                        response.text().then((data: string) => {
                            resolve(data);
                        });
                    } else {
                        reject();
                    }
                });
            });
        }, url);

        return data;
    }

    private static formatSize(size: string): number {
        return Number(size.replace(/\,/g, '.'));
    }

    public static async getProduct(url: string): Promise<any> {
        const page = await Browser.getPage();

        const sku: any = await page.evaluate((url) => {
            return new Promise((resolve, reject) => {
                const params = new URLSearchParams();
                params.append('pageType', 'Snkrs');
                params.append('actionType', 'Produto');
                params.append('pathname', url);

                fetch('https://www.nike.com.br/DataLayer/ajaxDataLayer', {
                    method: 'POST',
                    body: params,
                })
                    .then((response: any) => {
                        if (response.status === 200) {
                            response.json().then((data) => {
                                const { productInfo } = data;
                                const { productNikeId } = productInfo;
                                resolve(productNikeId);
                            });
                        }
                    })
                    .catch(reject);
            });
        }, url);

        const sneaker: any = await this.getSneaker(sku);
        const sneakerPage = await this.getSneakerPage(url);

        const [_head, tail] = sneakerPage.split('var SKUsCorTamanho = ');
        const [head, _tail] = tail.split('</script>');

        const sizes: Array<any> = Object.values(JSON.parse(head));
        const [{ DtLancto: releaseDate }] = sizes;

        const result: Sneaker = {
            name: sneaker.name,
            release_date: moment(releaseDate, 'DD/MM HH:mm').toDate(),
            price: sneaker.price,
            image: 'https:' + sneaker.images.default,
            store: 'nike',
            url,
            sizes: sneaker.skus
                .reduce((prev, next) => {
                    if (prev.some(({ nike_id }) => nike_id === next.sku)) {
                        return prev;
                    }

                    return [
                        ...prev,
                        {
                            nike_id: next.sku,
                            name: next.specs.size,
                            stock: next.stock,
                        },
                    ];
                }, [])
                .sort(
                    (a: Size, b: Size) =>
                        this.formatSize(a.name) - this.formatSize(b.name)
                ),
        };

        return result;
    }

    public static async getProducts(): Promise<Array<Sneaker>> {
        const page = await Browser.getPage();

        const data: any = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                fetch('https://www.nike.com.br/Snkrs#estoque', {
                    method: 'GET',
                }).then((response) => {
                    if (response.status === 200) {
                        response.text().then((data: string) => {
                            resolve(data);
                        });
                    } else {
                        reject();
                    }
                });
            });
        });

        const { window } = new JSDOM(data);
        const { document } = window;

        const sneakers = document.querySelectorAll('.produto--comprar');

        const result: Array<Sneaker> = Array.from(sneakers).map(
            (sneaker: Element) => {
                const name: string = sneaker.querySelector(
                    '.produto__detalhe-titulo'
                ).textContent;

                const url: string = sneaker.querySelector('a').href;

                const image = sneaker
                    .querySelector('img')
                    .getAttribute('data-src');

                return {
                    name,
                    url,
                    store: 'nike',
                    image,
                };
            }
        );

        return result;
    }

    public static async getCalendar(): Promise<Array<Sneaker>> {
        const page = await Browser.getPage();

        const data: any = await page.evaluate(() => {
            return new Promise((resolve, reject) => {
                fetch('https://www.nike.com.br/Snkrs#calendario', {
                    method: 'GET',
                }).then((response) => {
                    if (response.status === 200) {
                        response.text().then((data: string) => {
                            resolve(data);
                        });
                    } else {
                        reject();
                    }
                });
            });
        });

        const { window } = new JSDOM(data);
        const { document } = window;

        const sneakers = document.querySelectorAll('.snkr-release');

        const result: Array<Sneaker> = Array.from(sneakers).map(
            (sneaker: Element) => {
                const nameElement = <HTMLElement>(
                    sneaker.querySelector('.snkr-release__name')
                );

                const name = nameElement.textContent;
                const url = nameElement.getAttribute('href');

                const releaseDate = (<HTMLElement>(
                    sneaker.querySelector('.snkr-release__mobile-date')
                        .parentElement
                )).textContent;

                const image = <HTMLImageElement>(
                    sneaker.querySelector('.snkr-release__img > img')
                );

                const [date, time] = releaseDate
                    .split(' ')
                    .filter(
                        (_word: string, index: number) =>
                            index === 2 || index === 4
                    );

                return {
                    name,
                    image: image.getAttribute('data-src'),
                    url,
                    store: 'nike',
                    release_date: moment(
                        `${date} ${time}`,
                        'DD/MM HH:mm'
                    ).toDate(),
                };
            }
        );

        return result;
    }
}
