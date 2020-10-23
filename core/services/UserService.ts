import { JSDOM } from 'jsdom';
import Browser from '../utils/Browser';
import BrowserPool from '../utils/BrowserPool'

type Address = {
    id: string;
    locale: string;
    type: string;
};

type CreditCard = {
    id: string;
    brand: string;
    lastDigits: number;
    expiresIn: string;
    holder: string;
    billingAddress: string;
};

export default class UserService {
    public static async getCreditCards(): Promise<Array<CreditCard>> {
        //const page = await Browser.getPage();

        const content: any = await BrowserPool.evaluate(() => {
            return new Promise((resolve) => {
                fetch('https://www.nike.com.br/Cartoes', {
                    method: 'GET',
                }).then((response) => {
                    response.text().then(resolve);
                });
            });
        });

        const { window }: JSDOM = new JSDOM(content);
        const { document } = window;

        const creditCards = Array.from(
            document.querySelectorAll(
                '.col-12.col-sm-6.col-md-4.col-xl-3.mb-2 > div'
            )
        ).map((creditCard: HTMLElement) => {
            const cardBody: HTMLElement = creditCard.querySelector(
                '.card-body'
            );
            const fields: any = Array.from(cardBody.children)
                .map((item) => {
                    const [key, value] = Array.from(item.children).map(
                        (text: HTMLElement) => text.textContent
                    );
                    return { [key]: value };
                })
                .reduce((prev, next) => Object.assign(prev, next), {});

            const cardHeader: HTMLElement = creditCard.querySelector(
                '.credit-card-header'
            );
            fields.brand = cardHeader.textContent;

            const cardFooter = creditCard.querySelector('.card-footer');
            fields.id = cardFooter
                .querySelector('[data-cardhash]')
                .getAttribute('data-cardhash');

            return {
                id: fields.id,
                brand: fields.brand,
                lastDigits: fields['Terminando em'],
                expiresIn: fields['Expira em'],
                holder: fields['Titular'],
                billingAddress: fields['Endereço de cobrança'],
            };
        });

        return creditCards;
    }

    public static async getAddresses(): Promise<Array<Address>> {
        //const page = await Browser.getPage();

        const content: any = await BrowserPool.evaluate(() => {
            return new Promise((resolve) => {
                fetch('https://www.nike.com.br/Entrega/MeusEnderecos', {
                    method: 'GET',
                }).then((response) => {
                    response.text().then(resolve);
                });
            });
        });

        const { window }: JSDOM = new JSDOM(content);
        const { document } = window;

        const addresses = Array.from(
            document.querySelectorAll('.col-lg-6.col-xl-4.mb-4 > div')
        ).map((address: HTMLElement) => {
            const id = address
                .querySelector('[data-enderecoid]')
                .getAttribute('data-enderecoid');
            const [locale, type] = Array.from(
                address.querySelectorAll('.valor-atributo')
            ).map((value: HTMLElement) => value.textContent);
            return { id, locale, type };
        });

        return addresses;
    }
}
