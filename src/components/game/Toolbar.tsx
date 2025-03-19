import { ReactNode, useEffect, useState } from 'react';
import { css } from '@emotion/react';
import CountUp from 'react-countup';

import { Box, Slider, Tooltip } from '@mui/joy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MuiTypography from '@mui/joy/Typography';

import { Button } from '../atoms/Button';
import { getTotalSequences, SequenceFoundResultObj } from '../../utils/sequences';

export function Toolbar({
    results,
    resetTime,
    performance,
    onReset
}: {
    results: SequenceFoundResultObj | undefined;
    resetTime: number;
    performance?: any;
    onReset: () => void;
}) {
    const [marks, setMarks] = useState<{ label: string; value: number }[]>([]);
    const [message, setMessage] = useState('Click on the grid to start upping values.');

    const foundSequences = getTotalSequences(results);

    useEffect(() => {
        const MESSAGES = [
            'Keep going!',
            'You got this!',
            'Almost there!',
            'You can do it!',
            'So close!',
            'Nice work!',
            'You are a Fibonacci master!',
            'You are on fire!',
            'You are a Fibonacci wizard!',
            'You are a Fibonacci genius!'
        ];

        if (foundSequences > 0) {
            setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
        }
    }, [foundSequences]);

    useEffect(() => {
        const marks = [
            {
                value: 0,
                label: ''
            },
            {
                value: Math.floor(
                    (performance.memory?.usedJSHeapSize / performance.memory?.totalJSHeapSize) * 100
                ),
                memory: (
                    <p>
                        Used heap memory:{' '}
                        {Math.floor(performance?.memory?.usedJSHeapSize / (1024 * 1024))} MB
                        <br />
                        Total heap memory:{' '}
                        {Math.floor(performance?.memory?.totalJSHeapSize / (1024 * 1024))} MB
                        <br />
                        Total available heap size:{' '}
                        {performance?.memory?.jsHeapSizeLimit / (1024 * 1024)} MB
                    </p>
                ),
                label: ''
            },
            {
                value: 100,
                memory: `${performance?.memory?.jsHeapSizeLimit / (1024 * 1024)} MB`,
                label: ''
            }
        ];
        // `Max: ${performance.memory?.jsHeapSizeLimit / (1024 * 1024)} MB`

        setMarks(marks);
    }, []);

    return (
        <div
            css={css`
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 20px 0;
            `}
        >
            <div
                css={css`
                    margin-right: 20px;
                `}
            >
                {results?.col.length || results?.row.length ? (
                    <>
                        Nice! Found {foundSequences} sequences. Resetting in...{' '}
                        <CountUp start={resetTime} end={0} duration={resetTime} useEasing={false} />
                    </>
                ) : (
                    <MuiTypography>{message}</MuiTypography>
                )}
            </div>

            <div
                css={css`
                    display: flex;
                    align-items: center;
                `}
            >
                {marks.length ? (
                    <Box sx={{ width: 300, padding: 3 }}>
                        <MuiTypography>Heap Memory Usage</MuiTypography>
                        <Slider
                            // disabled
                            // getAriaValueText={valueText}

                            valueLabelDisplay="on"
                            slots={{ valueLabel: MarkLabel }}
                            step={1}
                            // valueLabelDisplay="auto"
                            marks={marks}
                            value={marks.length ? marks[1].value : undefined}
                        />
                    </Box>
                ) : null}
                <Button
                    value={
                        <>
                            Reset
                            <RestartAltIcon />
                        </>
                    }
                    big
                    onClick={onReset}
                />
            </div>
        </div>
    );
}

export function MarkLabel({
    children,
    ownerState
}: {
    children: ReactNode;
    ownerState: { marks: Array<{ label: string; value: string; memory: number }> };
}) {
    const foo = ownerState.marks.find((mark) => mark.value === children);

    return (
        <Box sx={{ marginTop: 7 }}>
            <Tooltip title={foo?.memory} placement="bottom">
                <MuiTypography sx={{ fontSize: '14px' }}>{children}%</MuiTypography>
            </Tooltip>
        </Box>
    );
}
