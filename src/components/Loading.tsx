import React from 'react';
import styled from 'styled-components';

const StyledSvg = styled.svg`
    animation: rotate 2s linear infinite;
    @keyframes rotate {
        100% {
            transform: rotate(360deg);
        }
    }
`;

type LoadingProps = {
    width?: number;
    height?: number;
};

const Loading = ({ width = 40, height = 40 }: LoadingProps) => {
    return (
        <StyledSvg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width, height }}
        >
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </StyledSvg>
    );
};

export default Loading;
