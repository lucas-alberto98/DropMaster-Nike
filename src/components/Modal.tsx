import React from 'react';
import styled from 'styled-components';
import ButtonIcon from './ButtonIcon';

type OverlayProps = {
    visible: boolean;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Overlay = styled.div`
    z-index: 2;
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all ease 0.3s;
    background-color: ${(props: OverlayProps) =>
        props.visible ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
    visibility: ${(props: OverlayProps) =>
        props.visible ? 'visible' : 'hidden'};
    display: flex;
    justify-content: center;
    align-items: center;

    padding-top: 25px;
    padding-bottom: 25px;
`;

type StyledDivProps = {
    visible: boolean;
};

const StyledDiv = styled.div`
    background-color: #fff;
    padding-top: 40px;
    padding-bottom: 40px;
    padding-left: 50px;
    padding-right: 50px;
    width: 500px;
    border-radius: 5px;
    position: relative;
    height: 100%;
    display: ${(props: StyledDivProps) => (props.visible ? 'block' : 'none')};
    overflow: auto;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

type ModalProps = {
    children: React.ReactElement;
    visible: boolean;
    title: string;
    onClose: (event: React.MouseEvent) => void;
};

const Modal = ({ children, visible, onClose }: ModalProps) => {
    const onClickModal = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <Overlay visible={visible} onClick={onClose}>
            <StyledDiv visible={visible} onClick={onClickModal}>
                <h2 style={{ marginBottom: 20 }}>Selecione um tamanho</h2>
                <ButtonIcon
                    style={{ position: 'absolute', right: 10, top: 10 }}
                    onClick={onClose}
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
                {children}
            </StyledDiv>
        </Overlay>
    );
};

export default Modal;
