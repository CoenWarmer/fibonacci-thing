import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import CountUp from 'react-countup';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { Button } from '../atoms/Button';
import { getTotalSequences, SequenceFoundResultObj } from 'src/utils/sequences';

export function Toolbar({
    results,
    onReset
}: {
    results: SequenceFoundResultObj | undefined;
    onReset: () => void;
}) {
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
                        <CountUp start={5} end={0} duration={5} useEasing={false} />
                    </>
                ) : (
                    <>{message}</>
                )}
            </div>

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
    );
}
