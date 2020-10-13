import Browser from '../utils/Browser';

export default class AuthenticationService {
    public static async getUsername() {
        const page = await Browser.getPage();
        await page.goto('https://www.nike.com.br');

        const username = await page.evaluate(() => {
            const [username] = Array.from(
                document.querySelectorAll('.lnk-login-menu')
            ).map((e: HTMLElement) => e.innerText);
            return username;
        });

        return username;
    }
}
