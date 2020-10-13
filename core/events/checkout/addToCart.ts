import PurchaseService from '../../services/PurchaseService';

export default (_event: any, arg: any) => {
    const { item } = arg;
    return PurchaseService.addToCart(item);
};
