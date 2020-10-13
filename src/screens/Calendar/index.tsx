import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Content, CenterContent } from '../../components/Layout';
import Button from '../../components/Button';
import ScheduleService from '../../services/ScheduleService';
import Loading from '../../components/Loading';
import Modal from '../../components/Modal';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 4fr 4fr 4fr 4fr;
    gap: 20px 20px;
    @media (max-width: 1024px) {
        grid-template-columns: 3fr 3fr 3fr;
    }
    @media (max-width: 768px) {
        grid-template-columns: 2fr 2fr;
    }
`;

const Sneaker = styled.button`
    height: 300px;
    width: 100%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border: solid 2px rgba(0, 0, 0, 0.08);
    border-radius: 5px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all ease 0.3s;
    &:hover {
        opacity: 0.6;
    }
    @media (max-width: 1024px) {
        height: 230px;
        padding: 15px;
    }
`;

const SizesGrid = styled.div`
    display: grid;
    grid-template-columns: 3fr 3fr 3fr;
    gap: 20px 20px;
    @media (max-width: 768px) {
        grid-template-columns: 2fr 2fr;
    }
`;

type SizeButtonProps = {
    active: boolean;
};

const SizeButton = styled.button`
    border: solid 1px #333333;
    height: 45px;
    display: flex;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    transition: all ease 0.3s;
    align-self: flex-start;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 17px;
    background-color: ${(props: SizeButtonProps) =>
        props.active ? '#333333 !important' : '#fff'};
    font-weight: ${(props: SizeButtonProps) => (props.active ? 'bold' : '400')};
    color: ${(props: SizeButtonProps) =>
        props.active ? '#fff !important' : '#333333'};
    &:hover {
        background-color: #333333;
        border-color: #333333;
        color: #fff;
    }
`;

const Stepper = styled.div`
    border-radius: 8px;
    display: flex;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.05);
    padding-top: 5px;
    padding-bottom: 5px;
    margin-bottom: 20px;
    margin-left: auto;
    margin-right: auto;
`;

type StepProps = {
    active: boolean;
    disabled?: boolean;
};

const Step = styled.button`
    border-radius: 8px;
    padding-left: 10px;
    padding-right: 10px;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 15px;
    height: 40px;
    background-color: ${(props: StepProps) =>
        props.active ? '#fff !important' : 'transparent'};
    font-weight: ${(props: StepProps) => (props.active ? 'bold' : '400')};
    transition: all ease 0.3s;
    &:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
    &:disabled {
        cursor: not-allowed;
        background-color: transparent;
    }
    @media (max-width: 768px) {
        font-size: 13px;
    }
`;

const { ipcRenderer } = window.require('electron');

const Calendar = () => {
    const [sectionIndex, setSectionIndex] = useState(0);
    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [sneakers, setSneakers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState<any>({ sizes: [] });
    const [sizesModalVisible, setSizesModalVisible] = useState(false);
    const [selectedSize, setSelectedSize] = useState({ nike_id: null });

    const getProducts = async () => {
        setLoadingCalendar(true);
        const response = await ipcRenderer.invoke('get-products');
        setSneakers(response);
        setLoadingCalendar(false);
    };

    const getCalendar = async () => {
        setLoadingCalendar(true);
        const response = await ipcRenderer.invoke('get-calendar');
        setSneakers(response);
        setLoadingCalendar(false);
    };

    useEffect(() => {
        if (sectionIndex === 0) getCalendar();
        if (sectionIndex === 1) getProducts();
    }, [sectionIndex]);

    const scheduleSneaker = async (url: string) => {
        const response = await ipcRenderer.invoke('get-product', url);
        setSelectedProduct(response);
        setSizesModalVisible(true);
    };

    const submitSize = async () => {
        setSizesModalVisible(false);
        ScheduleService.create({
            ...selectedProduct,
            selected_size: selectedSize,
        });
    };

    const renderReleaseDate = (releaseDate: Date | null) => {
        const releaseDateMoment = moment(releaseDate);

        if (releaseDate && moment().isBefore(releaseDateMoment)) {
            return (
                <>
                    <h3 style={{ textTransform: 'uppercase', fontSize: 20 }}>
                        {releaseDateMoment.format('MMM')}
                    </h3>
                    <h1 style={{ fontSize: 32 }}>
                        {releaseDateMoment.format('DD')}
                    </h1>
                </>
            );
        }

        return null;
    };

    const renderContent = () => {
        if (loadingCalendar) {
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
                <Stepper>
                    <Step
                        active={sectionIndex === 0}
                        onClick={() => setSectionIndex(0)}
                    >
                        Calendário
                    </Step>
                    <Step
                        active={sectionIndex === 1}
                        onClick={() => setSectionIndex(1)}
                    >
                        Em estoque
                    </Step>
                </Stepper>
                <Grid>
                    {sneakers.map((sneaker: any, index: number) => {
                        return (
                            <div
                                key={`sneaker-${index}`}
                                style={{ width: '100%' }}
                            >
                                <Sneaker
                                    style={{
                                        backgroundImage: `url(${sneaker.image})`,
                                    }}
                                    onClick={() => scheduleSneaker(sneaker.url)}
                                >
                                    {renderReleaseDate(sneaker.release_date)}
                                </Sneaker>
                                <h3 style={{ marginTop: 15 }}>
                                    {sneaker.name}
                                </h3>
                            </div>
                        );
                    })}
                </Grid>
            </Content>
        );
    };

    return (
        <>
            <Modal
                visible={sizesModalVisible}
                onClose={() => setSizesModalVisible(false)}
                title="Escolha um tamanho"
            >
                <>
                    <SizesGrid>
                        {selectedProduct.sizes.map((size: any) => (
                            <SizeButton
                                key={size.nike_id}
                                onClick={() => setSelectedSize(size)}
                                active={size.nike_id === selectedSize.nike_id}
                            >
                                <span>
                                    {size.name} ({size.stock})
                                </span>
                            </SizeButton>
                        ))}
                    </SizesGrid>
                    <Button
                        title="Escolher"
                        style={{ marginLeft: 'auto', marginTop: 20 }}
                        onClick={submitSize}
                    />
                </>
            </Modal>
            {renderContent()}
        </>
    );
};

export default Calendar;
