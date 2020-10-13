import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Content, CenterContent } from '../../components/Layout';
import LocalStorageService from '../../services/LocalStorageService';
import Loading from '../../components/Loading';
import type { IStore } from '../../store';

const { ipcRenderer } = window.require('electron');

type ListItemProps = {
    selected: boolean;
};

const ListItem = styled.button`
    border-radius: 7px;
    margin-bottom: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 30px;
    padding-right: 30px;
    transition: all ease 0.3s;
    border: solid 1px;
    border-color: ${(props: ListItemProps) =>
        props.selected ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.1)'};
`;

const BillingData = () => {
    const dispatch = useDispatch();

    const user = useSelector((state: IStore) => state.user);

    const [loadingBillingData, setLoadingBillingData] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [creditCards, setCreditCards] = useState([]);

    const getCreditCards = async () => {
        const creditCards = await ipcRenderer.invoke('get-credit-cards');
        setCreditCards(creditCards);
    };

    const getAddresses = async () => {
        const addresses = await ipcRenderer.invoke('get-addresses');
        setAddresses(addresses);
    };

    const getBillingData = async () => {
        await getCreditCards();
        await getAddresses();
        setLoadingBillingData(false);
    };

    useEffect(() => {
        getBillingData();
    }, []);

    const selectCard = (cardId: string) => {
        LocalStorageService.set('selected_card', cardId);
        dispatch({
            type: 'SET_USER_SELECTED_CREDIT_CARD',
            payload: cardId,
        });
    };

    const selectAddress = (addressId: string) => {
        LocalStorageService.set('selected_address', addressId);
        dispatch({
            type: 'SET_USER_SELECTED_ADDRESS',
            payload: addressId,
        });
    };

    if (loadingBillingData) {
        return (
            <Content
                noVerticalPadding
                noHorizontalPadding
                style={{ height: '100%' }}
            >
                <CenterContent>
                    <Loading />
                </CenterContent>
            </Content>
        );
    }

    return (
        <Content>
            <h1>Cartões de crédito</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 20,
                }}
            >
                {creditCards.map((creditCard: any) => (
                    <ListItem
                        key={creditCard.id}
                        selected={user.selected_credit_card === creditCard.id}
                        onClick={() => selectCard(creditCard.id)}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <p
                                style={{
                                    fontWeight: 'bold',
                                    marginBottom: 3,
                                }}
                            >
                                {creditCard.brand}
                            </p>
                            <p>Terminado em {creditCard.lastDigits}</p>
                            <p>Expira em {creditCard.expiresIn}</p>
                        </div>
                    </ListItem>
                ))}
            </div>
            <h1 style={{ marginTop: 20 }}>Endereços de entrega</h1>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: 20,
                }}
            >
                {addresses.map((address: any) => (
                    <ListItem
                        key={address.id}
                        selected={user.selected_address === address.id}
                        onClick={() => selectAddress(address.id)}
                    >
                        <p>{address.locale}</p>
                    </ListItem>
                ))}
            </div>
        </Content>
    );
};

export default BillingData;
