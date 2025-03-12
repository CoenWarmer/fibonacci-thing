import React, { memo } from 'react';
import { css } from '@emotion/react';

export const Button = memo(
    ({
        value,
        active = false,
        big = false,
        disabled = false,
        onClick
    }: {
        value: number | string | React.ReactNode;
        big?: boolean;
        active?: boolean;
        disabled?: boolean;
        onClick: () => void;
    }) => {
        const buttonStyle = (big: boolean, active: boolean, disabled: boolean) => css`
            margin: 0 1px 0 0;
            padding: 0;
            width: ${big ? '40px' : '22px'};
            height: ${big ? '40px' : '22px'};
            min-width: auto;
            font-size: 8px;
            border: none;
            border-radius: 2px;
            border-color: #7394ec;
            background-color: ${active ? 'green' : disabled ? 'rgb(51, 76, 139)' : '#4b69b7'};
            color: ${disabled && !active ? '#999' : '#fff'};
            box-shadow: none;
            cursor: pointer;
            transition: background-color 0.05s ease-in-out;

            &:hover {
                background-color: #3452a1;
            }

            &:active {
                background-color: rgb(222, 222, 29);
                color: rgb(57, 81, 143);
                font-weight: bold;
            }
        `;

        return (
            <button disabled={disabled} css={buttonStyle(big, active, disabled)} onClick={onClick}>
                {value}
            </button>
        );
    }
);

Button.displayName = 'MemoizedButton';
