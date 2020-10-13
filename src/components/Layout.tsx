import styled from 'styled-components';

type ContentProps = {
    noVerticalPadding?: boolean;
    noHorizontalPadding?: boolean;
};

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding-left: ${(props: ContentProps) =>
        props.noHorizontalPadding ? '0' : '50px'};
    padding-right: ${(props: ContentProps) =>
        props.noHorizontalPadding ? '0' : '50px'};
    padding-top: ${(props: ContentProps) =>
        props.noVerticalPadding ? '70px' : '100px'};
    padding-bottom: ${(props: ContentProps) =>
        props.noVerticalPadding ? '56px' : '86px'};
    @media (max-width: 768px) {
        padding-left: ${(props: ContentProps) =>
            props.noHorizontalPadding ? '0' : '30px'};
        padding-right: ${(props: ContentProps) =>
            props.noHorizontalPadding ? '0' : '30px'};
        padding-top: ${(props: ContentProps) =>
            props.noVerticalPadding ? '60px' : '90px'};
    }
`;

export const CenterContent = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const Card = styled.div`
    width: 500px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

export const FormRow = styled.div`
    display: flex;
    & > * {
        margin-left: 10px;
        margin-right: 10px;
    }
    & > *:first-child,
    & > *:last-child {
        margin-left: 0;
        margin-right: 0;
    }
`;
