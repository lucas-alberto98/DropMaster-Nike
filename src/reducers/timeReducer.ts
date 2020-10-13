import moment from 'moment';
import type { ReduxAction } from '../types/ReduxAction';

const initialState = moment().toDate();

export default (state = initialState, action: ReduxAction) => {
    switch (action.type) {
        case 'SET_TIME':
            return action.payload;
        default:
            return state;
    }
};
