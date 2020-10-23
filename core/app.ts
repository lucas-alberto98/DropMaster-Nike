import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import getUsername from './events/authentication/getUsername';
import addToCart from './events/checkout/addToCart';
import purchase from './events/checkout/purchase';
import showMessageBox from './events/window/showMessageBox';
import removeFromCart from './events/checkout/removeFromCart';
import getAddresses from './events/user/getAddresses';
import getCreditCards from './events/user/getCreditCards';
import Browser from './utils/Browser';
import BrowserPool from './utils/BrowserPool';
import getCalendar from './events/calendar/getCalendar';
import getProduct from './events/calendar/getProduct';
import getProducts from './events/calendar/getProducts';
import createCheckoutPage from './events/checkout/createCheckoutPage';

import CalendarService from './services/artwalk/CalendarService';
import path = require('path');
import url = require('url');

CalendarService.getCalendar();

const packaged: boolean = app.isPackaged;

class Application {
    private mainWindow: BrowserWindow;

    public configureAutoUpdater(): void {
        autoUpdater.checkForUpdates();

        autoUpdater.on('update-downloaded', async () => {
            const { response } = await dialog.showMessageBox({
                buttons: ['Sim', 'Não', 'Cancelar'],
                title: 'Instalar atualização',
                type: 'question',
                message:
                    'Uma nova versão está disponível. Deseja instalar agora?',
            });

            if (response === 0) {
                autoUpdater.quitAndInstall();
            }
        });
    }

    private async createWindow(): Promise<void> {
        this.mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
            },
        });

        this.mainWindow.setMenuBarVisibility(false);

        const URL = packaged
            ? url.format({
                  pathname: path.join(__dirname, '../build/index.html'),
                  protocol: 'file:',
                  slashes: true,
              })
            : 'http://localhost:3000';

        this.mainWindow.loadURL(URL);

        if (!packaged) this.mainWindow.webContents.openDevTools();

        await BrowserPool.startPool();
        //await BrowserPool.sleep(2);
        await BrowserPool.goto('https://www.nike.com.br', { timeout: 0 });  
        
       
        
        this.mainWindow.on('closed', () => {
            this.mainWindow = null;
        });
    }

    public create(): void {
        app.on('ready', this.createWindow);

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (this.mainWindow === null) {
                this.createWindow();
            }
        });
    }

    public subscribeEvents(): void {
        ipcMain.handle('get-username', getUsername);
        ipcMain.handle('add-to-cart', addToCart);
        ipcMain.handle('remove-from-cart', removeFromCart);
        ipcMain.handle('purchase', purchase);
        ipcMain.handle('get-credit-cards', getCreditCards);
        ipcMain.handle('get-addresses', getAddresses);
        ipcMain.handle('show-message-box', showMessageBox);
        ipcMain.handle('get-calendar', getCalendar);
        ipcMain.handle('get-product', getProduct);
        ipcMain.handle('get-products', getProducts);
        ipcMain.handle('create-checkout-page', createCheckoutPage);
    }
}

const application = new Application();

application.create();
application.subscribeEvents();
if (packaged) application.configureAutoUpdater();
