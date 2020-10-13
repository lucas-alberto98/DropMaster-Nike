import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Content, CenterContent } from '../../components/Layout';
import SneakerItem from '../../components/SneakerItem';
import type { IStore } from '../../store';
import type { Sneaker } from '../../types/Sneaker';

const FAB = styled.button`
    height: 50px;
    width: 50px;
    border-radius: 50%;
    position: fixed;
    bottom: 76px;
    right: 20px;
    background-color: #333333;
    box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
        0px 6px 10px 0px rgba(0, 0, 0, 0.14),
        0px 1px 18px 0px rgba(0, 0, 0, 0.12);
    transition: all ease 0.3s;
    &:hover {
        background-color: #000;
        transform: scale(1.1);
    }
`;

const { ipcRenderer } = window.require('electron');

const Home = () => {
    const history = useHistory();

    const schedule = useSelector((state: IStore) => state.schedule);
    const dispatch = useDispatch();

    const renderContent = () => {
        if (!schedule.length) {
            return (
                <Content
                    noVerticalPadding
                    noHorizontalPadding
                    style={{ height: '100%' }}
                >
                    <CenterContent>
                        <p
                            style={{
                                color: 'rgba(0, 0, 0, 0.6)',
                                textAlign: 'center',
                            }}
                        >
                            Você ainda não adicionou nenhum Sneaker na sua
                            agenda.
                        </p>
                    </CenterContent>
                </Content>
            );
        }

        return (
            <Content
                noVerticalPadding
                noHorizontalPadding
                style={{ marginBottom: 86 }}
            >
                {schedule.map((sneaker: Sneaker) => (
                    <SneakerItem
                        key={sneaker._id}
                        sneaker={sneaker}
                        onClick={() => history.push(`/sneaker/${sneaker._id}`)}
                    />
                ))}
            </Content>
        );
    };

    return (
        <>
            {renderContent()}
            <FAB onClick={() => history.push('/calendar')}>
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
                    style={{ color: '#fff' }}
                >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </FAB>
        </>
    );
};

export default Home;
