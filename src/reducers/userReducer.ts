import LocalStorageService from '../services/LocalStorageService';
import type { ReduxAction } from '../types/ReduxAction';

const initialState = {
    authenticated: false,
    nike_username: null,
    selected_credit_card: LocalStorageService.get('selected_card'),
    selected_address: LocalStorageService.get('selected_address'),
};

export default (state = initialState, action: ReduxAction) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return { ...state, ...action.payload, authenticated: true };
        case 'SET_USER_NIKE_USERNAME':
            return { ...state, nike_username: action.payload };
        case 'SET_USER_SELECTED_CREDIT_CARD':
            return { ...state, selected_credit_card: action.payload };
        case 'SET_USER_SELECTED_ADDRESS':
            return { ...state, selected_address: action.payload };
        default:
            return state;
    }
};
