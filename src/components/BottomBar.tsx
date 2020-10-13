import React from 'react';
import styled from 'styled-components';
import { useLocation, useHistory } from 'react-router-dom';

type BottomBarButtonProps = {
    active?: boolean;
};

const BottomBarButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100%;
    transition: all ease 0.2s;
    font-weight: ${(props: BottomBarButtonProps) =>
        props.active ? '500' : '400'};
    color: ${(props: BottomBarButtonProps) =>
        props.active ? '#333333' : 'rgba(0, 0, 0, 0.65)'};
    transform: ${(props: BottomBarButtonProps) =>
        props.active ? 'scale(1.08)' : 'inherit'};
    & > svg {
        color: ${(props: BottomBarButtonProps) =>
            props.active ? '#333333' : 'rgba(0, 0, 0, 0.65)'};
    }
`;

const bottomBarButtons = [
    {
        label: 'Agenda',
        path: '/',
        icon: (
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
        ),
    },
    {
        label: 'reCAPTCHA v3',
        path: '/recaptcha',
        icon: (
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
                <path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18"></path>
                <path d="M4.73 4.73L4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        ),
    },
    {
        label: 'Dados de compra',
        path: '/billing-data',
        icon: (
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
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
        ),
    },
];

const BottomBar = () => {
    const history = useHistory();
    const location = useLocation();

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                backgroundColor: '#fff',
                height: 56,
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                boxShadow:
                    '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
            }}
        >
            {bottomBarButtons.map((button: any, index: number) => (
                <BottomBarButton
                    key={`bottom-bar-button-${index}`}
                    active={location.pathname === button.path}
                    onClick={() => history.push(button.path)}
                >
                    {button.icon}
                    <span style={{ marginTop: 3, fontSize: 13 }}>
                        {button.label}
                    </span>
                </BottomBarButton>
            ))}
        </div>
    );
};

export default BottomBar;
