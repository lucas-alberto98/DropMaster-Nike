import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import Login from './screens/Login';
import Home from './screens/Home';
import Calendar from './screens/Calendar';
import Recaptcha from './screens/Recaptcha';
import AppBar from './components/AppBar';
import BottomBar from './components/BottomBar';
import NikeLogin from './screens/NikeLogin';
import BillingData from './screens/BillingData';
import LocalStorageService from './services/LocalStorageService';
import { CenterContent, Content } from './components/Layout';
import Loading from './components/Loading';
import type { IStore } from './store';
import SneakerDetails from './screens/SneakerDetails';

const Router = () => {
    const user = useSelector((state: IStore) => state.user);
    const token = LocalStorageService.get('access_token');

    if (user.authenticated === false) {
        if (token) {
            return (
                <Content
                    noVerticalPadding
                    noHorizontalPadding
                    style={{ height: '100%', padding: 0 }}
                >
                    <CenterContent>
                        <Loading />
                    </CenterContent>
                </Content>
            );
        } else {
            return <Login />;
        }
    }

    if (user.nike_username) {
        return (
            <>
                <AppBar />
                <Switch>
                    <Route path="/" component={Home} exact />
                    <Route
                        path="/sneaker/:id"
                        component={SneakerDetails}
                        exact
                    />
                    <Route path="/calendar" component={Calendar} exact />
                    <Route path="/recaptcha" component={Recaptcha} exact />
                    <Route path="/billing-data" component={BillingData} />
                </Switch>
                <BottomBar />
            </>
        );
    }

    return <NikeLogin />;
};

export default Router;
