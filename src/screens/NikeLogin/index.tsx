import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CenterContent } from '../../components/Layout';
import Button from '../../components/Button';
import Logo from '../../components/Logo';

const LogoWrapper = styled.div`
    & > svg {
        width: 50px;
        fill: #333333;
        margin-bottom: 20px;
        cursor: pointer;
        transition: all ease 0.3s;
        &:hover {
            transform: scale(1.1);
        }
    }
`;

const { ipcRenderer } = window.require('electron');

const NikeLogin = () => {
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    const getUsername = () => ipcRenderer.invoke('get-username');

    const login = async () => {
        setSubmitting(true);

        const username = await getUsername();

        setSubmitting(false);

        if (username) {
            dispatch({ type: 'SET_USER_NIKE_USERNAME', payload: username });
        }
    };

    useEffect(() => {
        login();
    }, []);

    return (
        <CenterContent>
            <LogoWrapper>
                <Logo />
            </LogoWrapper>
            <h1 style={{ marginBottom: 10 }}>Login no site da Nike</h1>
            <span
                style={{
                    maxWidth: 600,
                    textAlign: 'center',
                    color: 'rgba(0, 0, 0, 0.6)',
                }}
            >
                É necessário que você entre na sua conta da Nike para que
                possamos vincular seus cartões e os seus endereços.
            </span>
            <Button
                title={submitting ? 'Verificando...' : 'Já entrei'}
                onClick={login}
                disabled={submitting}
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 20,
                }}
            />
        </CenterContent>
    );
};

export default NikeLogin;
