import { css } from '@emotion/react';
import { LegendLabel } from '../atoms/LegendLabel';

export function Legend({ size }: { size: number }) {
    const sizeArr = Array.from({ length: size });

    const style = (y: number) => css`
        position: absolute;
        width: 22px;
        height: 22px;
        margin-left: -22px;
        margin-top: ${y * 23}px;
        margin-bottom: 4px;
    `;

    return (
        <>
            <div
                css={css`
                    display: flex;
                `}
            >
                {sizeArr.map((_, y) => (
                    <LegendLabel label={y} key={y} />
                ))}
            </div>

            {sizeArr.map((_, y) => (
                <div key={y} css={style(y)}>
                    <LegendLabel label={y} />
                </div>
            ))}
        </>
    );
}
