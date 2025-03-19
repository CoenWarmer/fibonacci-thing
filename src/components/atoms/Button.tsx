import { CSSProperties, memo } from 'react';
import { css, CSSObject } from '@emotion/react';
import MuiTypography from '@mui/joy/Typography';

export const Button = memo(
    ({
        value,
        col,
        row,
        active = false,
        big = false,
        disabled = false,
        style,
        onClick
    }: {
        value: number | string | React.ReactNode;
        col?: number;
        row?: number;
        big?: boolean;
        active?: boolean;
        disabled?: boolean;
        style?: CSSProperties;
        onClick: () => void;
    }) => {
        const buttonStyle = (big: boolean, active: boolean, disabled: boolean) => css`
            padding: 0;
            width: ${big ? '40px' : '22px'};
            height: ${big ? '40px' : '22px'};
            min-width: auto;
            border: none;
            border-radius: 2px;
            border: 1px solid #fff;
            background-color: ${active ? 'green' : disabled ? 'rgb(51, 76, 139)' : '#4b69b7'};
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
            <button
                disabled={disabled}
                css={[buttonStyle(big, active, disabled), style as CSSObject]}
                onClick={onClick}
                title={`row: ${row}; col: ${col}`}
            >
                <MuiTypography
                    sx={{ fontSize: '10px', color: disabled && !active ? '#999' : '#fff' }}
                >
                    {value}
                </MuiTypography>
            </button>
        );
    }
);

Button.displayName = 'MemoizedButton';
