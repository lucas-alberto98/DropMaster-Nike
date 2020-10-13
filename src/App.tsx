import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import 'moment/locale/pt-br';
import Router from './Router';
import store from './store';
import './index.css';
import ApiService from './services/ApiService';
import LocalStorageService from './services/LocalStorageService';
import ScheduleService from './services/ScheduleService';

ScheduleService.listen();

const App = () => {
    const getMe = async () => {
        const response = await ApiService.call('/users/me', 'GET');
        const data = await response.json();
        store.dispatch({ type: 'SET_USER_DATA', payload: data });
    };

    useEffect(() => {
        const accessToken = LocalStorageService.get('access_token');
        if (accessToken) getMe();
    }, []);

    return (
        <Provider store={store}>
            <HashRouter>
                <Router />
            </HashRouter>
        </Provider>
    );
};

export default App;
