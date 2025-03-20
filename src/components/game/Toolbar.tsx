import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { Box, CircularProgress, IconButton } from '@mui/joy';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MuiTypography from '@mui/joy/Typography';

import { GridSlider } from './GridSlider';
import { Memory } from './Memory';
import { Button } from '../atoms/Button';
import { getTotalSequences, SequenceFoundResultObj } from '../../utils/sequences';

export function Toolbar({
    disabled,
    results,
    resetTime,
    performance,
    initialGridSize,
    onChangeGridSize,
    onReset
}: {
    disabled: boolean;
    results: SequenceFoundResultObj | undefined;
    resetTime: number;
    initialGridSize: number;
    onChangeGridSize: (gridSize: number) => void;
    performance?: any;
    onReset: () => void;
}) {
    const [loading, setLoading] = useState(false);
    const [gridSize, setGridSize] = useState(initialGridSize);
    const [message, setMessage] = useState('Click on the grid to start upping values.');

    const foundSequences = getTotalSequences(results);

    const handleChangeGridSize = (newGridSize: number) => {
        setGridSize(newGridSize);
        onChangeGridSize(newGridSize);
        setLoading(true);
    };

    useEffect(() => {
        const MESSAGES = [
            'Keep going!',
            'You got this!',
            'Almost there!',
            'You can do it!',
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
        if (initialGridSize === gridSize) {
            setLoading(false);
        }
    }, [initialGridSize]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '20px 0'
            }}
        >
            <Box
                sx={{
                    marginRight: '20px'
                }}
            >
                {results?.col.length || results?.row.length ? (
                    <>
                        Nice! Found {foundSequences} sequences. Resetting in...{' '}
                        <CountUp start={resetTime} end={0} duration={resetTime} useEasing={false} />
                    </>
                ) : (
                    <MuiTypography>{message}</MuiTypography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 0,
                    gap: 4
                }}
            >
                {loading ? <CircularProgress /> : null}
                <GridSlider
                    disabled={disabled}
                    gridSize={gridSize}
                    onChange={() => setLoading(true)}
                    onChangeGridSize={handleChangeGridSize}
                />
                <Memory performance={performance} />
                <IconButton
                    disabled={disabled}
                    color="primary"
                    variant="solid"
                    sx={{ padding: '8px 10px', gap: '4px' }}
                    onClick={onReset}
                >
                    Reset
                    <RestartAltIcon />
                </IconButton>
            </Box>
        </Box>
    );
}
