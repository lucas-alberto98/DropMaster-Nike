import { Cluster } from 'puppeteer-cluster';
import puppeteer = require('puppeteer');
import { Platform } from '../contants';
import fs = require('fs');
import Browser from './Browser';

export default class BrowserPool{

    private static pool : Array<puppeteer.Browser> = [];

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

    private static makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
     

    public static async startPool(){

        let proxys = JSON.parse(await fs.readFileSync(__dirname + '/../../ProxyFile.json' , 'utf8'));
        console.log(proxys)
        console.log(proxys.proxys)
        let numberInstance = proxys.proxys.length

        if(proxys.skip){
            numberInstance = 5
        }

        for (let index = 0; index < numberInstance; index++) {
            let instance = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox', !proxys.skip ? '--proxy-server=' + proxys.proxys[index] : 'about:blank'],
                executablePath: this.getChromePath(),
                userDataDir : __dirname + '/../../temp/' + this.makeid(10),
                defaultViewport : {
                    width : 1280,
                    height : 720,
                    isMobile : false,
                }
                
            });
            this.pool.push(instance)
            
        }
    }

    public static async goto(url : string, prm ?: object){
        this.pool.map(async instance => {
            //let page = await instance.targets()[0].page();
            let page =  (await instance.pages())[0];
            await page.goto(url, prm);
        });
        
    }

    public static async evaluate(fn, obj?){
        return new Promise((res, rej) =>{
            this.pool.forEach(async instance => {
                let page = (await instance.pages())[0];
                console.log(fn);
                let resp = await page.evaluate(fn, obj) 
                res(resp)
            });
        })
        
    }

    public static async sleep(secound : number){
        return new Promise((res) => {
            setTimeout(() => res(true), secound * 1000)
        })
    }
}