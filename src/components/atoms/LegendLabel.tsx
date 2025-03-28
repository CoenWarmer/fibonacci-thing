import { css } from '@emotion/react';

export function LegendLabel({ label }: { label: string | number }) {
    const labelStyle = css`
        display: flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        min-width: auto;
        font-size: 8px;
        margin: 0 1px 1px 0;
    `;

    return <div css={labelStyle}>{label}</div>;
}
