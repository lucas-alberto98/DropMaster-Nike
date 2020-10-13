import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import type { Sneaker, Log } from '../../types/Sneaker';
import SneakerItem from '../../components/SneakerItem';
import { Content } from '../../components/Layout';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { IStore } from '../../store';
import { NIKE_ERROR_MESSAGES } from '../../constants';

interface LogProps {
    status: 'success' | 'failure';
}

const LogItemIconWrapper = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    border-color: ${(props: LogProps) =>
        props.status === 'success' ? '#4caf50' : '#fe0000'};
    & > svg {
        color: ${(props: LogProps) =>
            props.status == 'success' ? '#4caf50' : '#fe0000'};
    }
`;

const LogItem = styled.div`
    height: 70px;
    width: 100%;
    border-bottom: solid 1px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    padding-left: 15px;
    padding-right: 15px;
`;

const SneakerDetails = () => {
    const [sneaker, setSneaker] = useState<Sneaker | null>(null);

    const { id } = useParams();

    const schedule = useSelector((state: IStore) => state.schedule);

    useEffect(() => {
        const sneaker: Sneaker | undefined = schedule.find(
            (sneaker: Sneaker) => sneaker._id == id
        );
        if (sneaker) {
            setSneaker(sneaker);
        }
    }, [schedule]);

    const renderIcon = (status: 'success' | 'failure') => {
        if (status === 'success') {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            );
        } else {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
            );
        }
    };

    const getLogLabel = (log: Log) => {
        const { response, step } = log;

        const { success } = response;

        if (step === 'created') return 'Sneaker agendado com sucesso';

        if (step === 'cart') {
            if (success) return 'Produto adicionado no carrinho com sucesso';
        }

        if (step === 'purchase') {
            if (success) return 'Compra efetuada com sucesso';
            const { msg } = response;
            if (msg === NIKE_ERROR_MESSAGES.CANNOT_PURCHASE_QUANTITY)
                return 'Este produto não tem estoque disponível';
            if (msg === NIKE_ERROR_MESSAGES.CREDIT_CARD_NOT_AUTHORIZED)
                return 'Cartão de crédito não autorizado';
            if (msg === NIKE_ERROR_MESSAGES.CANNOT_PURCHASE_VALUE)
                return 'O produto não está mais no carrinho';
            if (msg === NIKE_ERROR_MESSAGES.CANNOT_CONTACT_PAYMENT_GATEWAY)
                return 'O site da Nike não conseguiu efetuar o pagamento';
        }

        return 'Não foi possível obter o status';
    };

    if (sneaker) {
        return (
            <Content noVerticalPadding noHorizontalPadding>
                <SneakerItem sneaker={sneaker} elevated showActions />
                <div>
                    {sneaker.logs.map((log) => {
                        const status = log.response.success
                            ? 'success'
                            : 'failure';

                        return (
                            <LogItem key={log._id}>
                                <LogItemIconWrapper status={status}>
                                    {renderIcon(status)}
                                </LogItemIconWrapper>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <span>{getLogLabel(log)}</span>
                                    <small style={{ marginTop: 3 }}>
                                        {moment(log.created_at).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )}
                                    </small>
                                </div>
                            </LogItem>
                        );
                    })}
                </div>
            </Content>
        );
    }

    return null;
};

export default SneakerDetails;
