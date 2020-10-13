import { createStore, combineReducers } from 'redux';
import moment from 'moment';
import scheduleReducer from './reducers/scheduleReducer';
import userReducer from './reducers/userReducer';
import timeReducer from './reducers/timeReducer';
import type { User } from './types/User';
import type { Sneaker } from './types/Sneaker';

export type IStore = {
    schedule: Array<Sneaker>;
    user: User;
    time: moment.Moment;
};

export default createStore(
    combineReducers({
        schedule: scheduleReducer,
        user: userReducer,
        time: timeReducer,
    })
);
