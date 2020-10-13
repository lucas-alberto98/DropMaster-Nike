import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    border: solid 1px #333333;
    height: 50px;
    display: flex;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    transition: all ease 0.3s;
    align-self: flex-start;
    padding-left: 30px;
    padding-right: 30px;
    font-weight: bold;
    font-size: 17px;
    background-color: #333333;
    color: rgba(255, 255, 255, 0.9);
    &:disabled {
        cursor: not-allowed;
        background-color: #333333 !important;
        color: rgba(255, 255, 255, 0.9) !important;
        opacity: 0.6;
    }
    &:hover {
        background-color: #fff;
        color: #333333;
    }
`;

type ButtonProps = {
    title: string;
    disabled?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    style?: React.CSSProperties;
};

const Button = ({ title, disabled = false, onClick, style }: ButtonProps) => {
    return (
        <StyledButton style={style} disabled={disabled} onClick={onClick}>
            {title}
        </StyledButton>
    );
};

export default Button;
