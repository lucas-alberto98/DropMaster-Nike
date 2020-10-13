import PurchaseService from '../../services/PurchaseService';

export default (_event: any, arg: string) => PurchaseService.removeFromCart(arg);
