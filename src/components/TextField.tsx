import React from 'react';
import styled from 'styled-components';

type StyledInputProps = {
    haveError: boolean;
};

const StyledInput = styled.input`
    border: solid 1px;
    height: 50px;
    display: flex;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    transition: all ease 0.3s;
    align-self: flex-start;
    padding-left: 15px;
    padding-right: 15px;
    font-weight: 400;
    font-size: 17px;
    width: 100%;
    border-color: ${(props: StyledInputProps) =>
        props.haveError ? '#fe0000 !important' : 'rgba(0, 0, 0, 0.3)'};
    &:hover {
        border-color: #333333;
    }
    &:focus {
        border-color: #333333;
    }
`;

const ErrorMessage = styled.small`
    display: block;
    color: #fe0000;
    font-weight: 500;
    margin-top: 7px;
`;

type TextFieldProps = {
    type: string;
    name: string;
    placeholder: string;
    error?: string;
    maxLength?: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    value: string;
};

const TextField = ({
    type,
    name,
    placeholder,
    error,
    maxLength,
    onChange,
    onBlur,
    value = '',
}: TextFieldProps) => {
    return (
        <div style={{ width: '100%', marginBottom: 20 }}>
            <StyledInput
                type={type}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                maxLength={maxLength}
                haveError={Boolean(error)}
                value={value}
            />
            <ErrorMessage>{error}</ErrorMessage>
        </div>
    );
};

export default TextField;
