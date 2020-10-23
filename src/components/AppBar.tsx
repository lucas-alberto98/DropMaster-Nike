import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ButtonIcon from './ButtonIcon';
import Logo from './Logo';
import type { IStore } from '../store';

const LogoWrapper = styled.button`
    font-weight: 500;
    color: #333333;
    & > svg {
        height: 30px;
        fill: #333333;
        transition: all ease 0.3s;
    }
    &:hover > svg {
        fill: #000;
        transform: scale(1.1);
    }
`;

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    padding-left: 30px;
    padding-right: 30px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
        0px 4px 5px 0px rgba(0, 0, 0, 0.14),
        0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    justify-content: space-between;
    background-color: #fff;
    height: 70px;
    z-index: 1;
    position: fixed;
    width: 100%;
    background-color: #fff;
    display: flex;
    @media (max-width: 768px) {
        height: 60px;
    }
`;

const AppBarItem = styled.div`
    width: 70px;
    display: flex;
    justify-content: flex-end;
`;

const { ipcRenderer } = window.require('electron');

const AppBar = () => {
    const [creatingCheckoutPage, setCreatingCheckoutPage] = useState(false);
    const time = useSelector((state: IStore) => state.time);

    const history = useHistory();

    const createCheckoutPage = async () => {
        setCreatingCheckoutPage(true);
        //await ipcRenderer.invoke('create-checkout-page');
        ipcRenderer.invoke('create-checkout-page');
        setCreatingCheckoutPage(false);
    };

    return (
        <StyledHeader>
            <AppBarItem style={{ justifyContent: 'flex-start' }}>
                <span style={{ fontWeight: 'bold' }}>
                    {moment(time).format('HH:mm:ss')}
                </span>
            </AppBarItem>
            <LogoWrapper onClick={() => history.push('/')}>
                <Logo />
            </LogoWrapper>
            <AppBarItem style={{ alignItems: 'flex-end' }}>
                <ButtonIcon
                    onClick={createCheckoutPage}
                    disabled={creatingCheckoutPage}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                </ButtonIcon>
            </AppBarItem>
        </StyledHeader>
    );
};

export default AppBar;
