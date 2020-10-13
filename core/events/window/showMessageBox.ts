import { dialog } from 'electron';

export default (_event: Electron.Event, arg: any) => {
    return new Promise((resolve) => {
        const response = dialog.showMessageBox(arg);
        resolve(response);
    });
};
