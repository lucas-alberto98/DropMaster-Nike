import { Platform } from '../contants';
import puppeteer = require('puppeteer');
import fs = require('fs');

export default class Browser {
    private static instance: puppeteer.Browser;
    private static page: puppeteer.Page;

    private static getChromePath(): string {
        if (process.platform === Platform.WINDOWS) {
            const x86Directory =
                'C:/Program Files/Google/Chrome/Application/chrome.exe';
            const x64Directory =
                'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe';

            if (fs.existsSync(x64Directory)) return x64Directory;
            return x86Directory;
        }

        if (process.platform === Platform.MAC)
            return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
        return '';
    }

    private static getChromeProfilePath(): string {
        if (process.platform === Platform.WINDOWS)
            return (
                process.env.APPDATA + `/Local/Google/Chrome/User Data/Profile`
            );
        if (process.platform === Platform.MAC)
            return (
                process.env.HOME +
                `/Library/Application Support/Google/Chrome/Default`
            );
        return '';
    }

    public static async open() {
        /*
            this.instance = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox'],
                executablePath: this.getChromePath(),
                userDataDir: this.getChromeProfilePath(),
            });
        */
    }

    public static close() {
        return this.instance.close();
    }

    public static async getPage(): Promise<puppeteer.Page> {
        if (!this.page || this.page.isClosed()) {
            this.page = await Browser.instance.newPage();
            return this.page;
        }
        return Promise.resolve(this.page);
    }

    public static newPage(): Promise<puppeteer.Page> {
        return this.instance.newPage();
    }
}
