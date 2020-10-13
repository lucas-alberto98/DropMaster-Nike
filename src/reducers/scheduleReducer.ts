import ScheduleService from '../services/ScheduleService';
import type { Sneaker } from '../types/Sneaker';
import type { ReduxAction } from '../types/ReduxAction';

const initialState: Array<Sneaker> = ScheduleService.getAll();

export default (state = initialState, action: ReduxAction) => {
    switch (action.type) {
        case 'SET_SCHEDULE':
            return action.payload;
        case 'ADD_SCHEDULE_ITEM':
            return [action.payload, ...state];
        default:
            return state;
    }
};
