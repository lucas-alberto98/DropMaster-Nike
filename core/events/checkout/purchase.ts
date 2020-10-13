import PurchaseService from '../../services/PurchaseService';

export default (_event: any, arg: any) => {
    const { creditCard, address } = arg;
    return PurchaseService.purchase(creditCard, address);
};
