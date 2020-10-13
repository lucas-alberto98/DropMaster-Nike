import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import type { Sneaker } from '../types/Sneaker';
import type { IStore } from '../store';
import PurchaseService from '../services/PurchaseService';
import ButtonIcon from './ButtonIcon';
import ScheduleService from '../services/ScheduleService';
import { useHistory } from 'react-router-dom';

type StyledButtonProps = {
    elevated?: boolean;
    onClick?: (event: React.MouseEvent) => void;
};

const StyledButton = styled.div`
    height: 130px;
    background-color: #fff;
    border-bottom: ${(props: StyledButtonProps) =>
        props.elevated ? 'none' : 'solid 1px rgba(0, 0, 0, 0.12)'};
    width: 100%;
    display: flex;
    padding: 15px;
    justify-content: space-between;
    transition: all ease 0.3s;
    box-shadow: ${(props: StyledButtonProps) =>
        props.elevated
            ? '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
            : 'inherit'};
    cursor: ${(props: StyledButtonProps) =>
        props.onClick ? 'pointer' : 'default'};
    &:hover {
        background-color: ${(props: StyledButtonProps) =>
            props.onClick ? 'rgba(0, 0, 0, 0.05)' : 'inherit'};
    }
`;

const Image = styled.div`
    height: 100%;
    width: 120px;
    border-radius: 7px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 20px;
`;

type SneakerProps = {
    sneaker: Sneaker;
    elevated?: boolean;
    showActions?: boolean;
    onClick?: (event: React.MouseEvent) => void;
};

const { ipcRenderer } = window.require('electron');

const SneakerItem = ({
    sneaker,
    onClick,
    elevated,
    showActions,
}: SneakerProps) => {
    const [remainingTime, setRemainingTime] = useState(
        moment(sneaker.release_date).fromNow()
    );
    const time = useSelector((state: IStore) => state.time);

    const history = useHistory();

    useEffect(() => {
        const _remainingTime = moment(sneaker.release_date).fromNow();
        if (_remainingTime !== remainingTime) {
            setRemainingTime(_remainingTime);
        }
    }, [time]);

    const removeSneaker = async () => {
        const { response: option } = await ipcRenderer.invoke(
            'show-message-box',
            {
                buttons: ['Sim', 'Não', 'Cancelar'],
                title: 'Confirmar',
                type: 'question',
                message: 'Deseja mesmo remover essa compra?',
            }
        );
        if (option === 0) {
            ScheduleService.remove(sneaker._id);
            history.push('/');
        }
    };

    const toggleCheckout = () => {
        if (sneaker.checkout_in_progress) {
            ScheduleService.update(sneaker._id, {
                checkout_in_progress: false,
            });
        } else {
            PurchaseService.startCheckout(sneaker._id);
        }
    };

    const renderPurchaseButton = () => {
        const renderIcon = () => {
            if (sneaker.checkout_in_progress) {
                return (
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
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                );
            } else {
                return (
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
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                );
            }
        };

        if (moment().isAfter(sneaker.release_date)) {
            return (
                <ButtonIcon onClick={toggleCheckout} style={{ marginRight: 5 }}>
                    {renderIcon()}
                </ButtonIcon>
            );
        }

        return null;
    };

    const renderActions = () => {
        if (showActions) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {renderPurchaseButton()}
                    <ButtonIcon
                        onClick={removeSneaker}
                        disabled={sneaker.checkout_in_progress}
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
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </ButtonIcon>
                </div>
            );
        }

        return null;
    };

    return (
        <StyledButton onClick={onClick} elevated={elevated}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Image style={{ backgroundImage: `url(${sneaker.image})` }} />
                <div
                    style={{
                        flexDirection: 'row',
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                        }}
                    >
                        <span
                            style={{
                                fontWeight: 'bold',
                                marginBottom: 5,
                            }}
                        >
                            {sneaker.name}
                        </span>
                        <span style={{ marginBottom: 3, textAlign: 'left' }}>
                            Checkout {remainingTime}
                        </span>
                        <span style={{ textAlign: 'left' }}>
                            Tamanho{' '}
                            <strong>{sneaker.selected_size.name}</strong>
                        </span>
                    </div>
                    {renderActions()}
                </div>
            </div>
        </StyledButton>
    );
};

export default SneakerItem;
