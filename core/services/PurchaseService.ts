import Browser from '../utils/Browser';
import {
    RECAPTCHA_V3_SITE_KEY,
    PaymentMethod,
    CreditCardBrand,
} from '../contants';
import puppeteer = require('puppeteer');

export default class PurchaseService {
    private static checkoutPage: puppeteer.Page;

    private static getCreditCardBrand(brandName: string) {
        if (brandName === 'Visa') return CreditCardBrand.VISA;
        return CreditCardBrand.MASTERCARD;
    }

    public static async addToCart(item) {
        const page = this.checkoutPage || (await Browser.getPage());

        const params = {
            recaptchaKey: RECAPTCHA_V3_SITE_KEY,
            item,
        };

        const response = await page.evaluate(({ recaptchaKey, item }) => {
            return new Promise((resolve, reject) => {
                (<any>window).grecaptcha
                    .execute(recaptchaKey, {
                        action: 'add_to_cart',
                    })
                    .then((response) => {
                        const params = new URLSearchParams();
                        params.append('EPrincipal', item.selected_size.nike_id);
                        params.append('EAcessorio', '');
                        params.append('ECompreJunto', '');
                        params.append('AdicaoProdutoId', '');
                        params.append('Origem', '');
                        params.append('SiteId', '');
                        params.append('g-recaptcha-response', response);

                        fetch('https://www.nike.com.br/Carrinho/Adicionar', {
                            headers: {
                                accept:
                                    'application/json, text/javascript, */*; q=0.01',
                                'accept-language':
                                    'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                                'content-type':
                                    'application/x-www-form-urlencoded; charset=UTF-8',
                                'sec-fetch-dest': 'empty',
                                'sec-fetch-mode': 'cors',
                                'sec-fetch-site': 'same-origin',
                                'x-requested-with': 'XMLHttpRequest',
                            },
                            referrer: item.url,
                            referrerPolicy: 'no-referrer-when-downgrade',
                            body: params.toString(),
                            method: 'POST',
                            mode: 'cors',
                            credentials: 'include',
                        })
                            .then((response) => {
                                response.json().then(resolve);
                            })
                            .catch(reject);
                    });
            });
        }, params);

        return response;
    }

    public static async removeFromCart(id: string) {
        const page = this.checkoutPage || (await Browser.getPage());

        const response = await page.evaluate((id: string) => {
            return new Promise((resolve, reject) => {
                const params = new URLSearchParams();
                params.append('Codigo', id);
                params.append('SiteId', '106');
                params.append('customid', '');

                fetch('https://www.nike.com.br/Carrinho/Excluir', {
                    headers: {
                        accept:
                            'application/json, text/javascript, */*; q=0.01',
                        'accept-language':
                            'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                        'content-type':
                            'application/x-www-form-urlencoded; charset=UTF-8',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'x-requested-with': 'XMLHttpRequest',
                    },
                    referrer: 'https://www.nike.com.br/Carrinho',
                    referrerPolicy: 'no-referrer-when-downgrade',
                    body: params.toString(),
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                })
                    .then((response) => {
                        response.json().then(resolve);
                    })
                    .catch(reject);
            });
        }, id);

        return response;
    }

    public static async purchase(creditCard, address) {
        const page = this.checkoutPage || (await Browser.getPage());

        const params = {
            paymentMethod: PaymentMethod.CREDIT_CARD,
            creditCard: {
                ...creditCard,
                brand: this.getCreditCardBrand(creditCard.brand),
            },
            address,
        };

        if (!this.checkoutPage) {
            await page.goto('https://www.nike.com.br/Checkout');
            this.checkoutPage = page;
        }

        const response = await page.evaluate(
            ({ address, paymentMethod, creditCard }) => {
                return new Promise((resolve, reject) => {
                    const params = new URLSearchParams();
                    params.append('MeioPagamentoId', paymentMethod);
                    params.append('SalvarCartao', '0');
                    params.append('CartaoCreditoId', creditCard.id);
                    params.append('UltimosDigitos', creditCard.lastDigits);
                    params.append('ShippingType', 'Normal');
                    params.append('EnderecoId', address.id);
                    params.append('Parcelamento', '1');
                    params.append('DoisCartoes', '0');
                    params.append('Bandeira', creditCard.brand);
                    fetch('https://www.nike.com.br/Pagamento/gravarPedido', {
                        headers: {
                            accept:
                                'application/json, text/javascript, */*; q=0.01',
                            'accept-language':
                                'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                            'content-type':
                                'application/x-www-form-urlencoded; charset=UTF-8',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-origin',
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        referrer: 'https://www.nike.com.br/Checkout',
                        referrerPolicy: 'no-referrer-when-downgrade',
                        body: params.toString(),
                        method: 'POST',
                        mode: 'cors',
                        credentials: 'include',
                    })
                        .then((response) => {
                            response.json().then(resolve);
                        })
                        .catch(reject);
                });
            },
            params
        );

        return response;
    }

    public static async createCheckoutPage(): Promise<boolean> {
        if (!this.checkoutPage || this.checkoutPage.isClosed()) {
            this.checkoutPage = await Browser.newPage();
        }

        await this.checkoutPage.goto('https://www.nike.com.br');
        const addToCart: any = await this.addToCart({
            url:
                'https://www.nike.com.br/Produto/Meia-Nike-Sportswear-Everyday-Essentials-3-pares/1-2-8-258496',
            selected_size: {
                nike_id: '193145890763',
            },
        });

        if (addToCart.success) {
            await this.checkoutPage.goto('https://www.nike.com.br/Checkout');
            await this.removeFromCart('193145890763');
            return true;
        }

        throw new Error('could not add placeholder product to cart');
    }
}
