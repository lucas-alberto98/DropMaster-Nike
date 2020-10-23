import Browser from '../utils/Browser';
import BrowserPool from '../utils/BrowserPool';

export default class AuthenticationService {
    public static async getUsername() {

        await BrowserPool.goto('https://www.nike.com.br');

        const username = await BrowserPool.evaluate(() => {
            const [username] = Array.from(
                document.querySelectorAll('.lnk-login-menu')
            ).map((e: HTMLElement) => e.innerText);
            return username;
        });

        return username;
    }
}
