import styled from 'styled-components';

const ButtonIcon = styled.button`
    display: flex;
    padding: 10px;
    transition: all ease 0.3s;
    border-radius: 50%;
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    &:disabled {
        cursor: not-allowed;
        background-color: transparent !important;
        opacity: 0.6;
    }
`;

export default ButtonIcon;
