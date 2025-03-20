import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { Box, CircularProgress } from '@mui/joy';
import MuiTypography from '@mui/joy/Typography';

import { GridSlider } from './GridSlider';
import { Memory } from './Memory';
import { getTotalSequences, SequenceFoundResultObj } from '../../utils/sequences';
import { Pattern } from '@mui/icons-material';
import { ToolbarWorkerSwitch } from './ToolbarWorkerSwitch';

export function Toolbar({
    disabled,
    results,
    resetTime,
    performance,
    perfTime,
    initialGridSize,
    isWorkerEnabled,
    onChangeGridSize,
    onToggleWorker,
    onReset
}: {
    disabled: boolean;
    results: SequenceFoundResultObj | undefined;
    resetTime: number;
    initialGridSize: number;
    performance?: any;
    perfTime: number | undefined;
    isWorkerEnabled: boolean;
    onChangeGridSize: (gridSize: number) => void;
    onToggleWorker: (enabled: boolean) => void;
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

    const handleChange = () => {
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
                margin: '80px 0 30px'
            }}
        >
            <Box
                sx={{
                    mr: 2
                }}
            >
                <MuiTypography
                    component="h1"
                    variant="plain"
                    color="primary"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '3px',
                        fontSize: '1.5rem',
                        fontWeight: 900
                    }}
                    data-sb-field-path=".title"
                >
                    <Pattern />
                    Fibonacci Thing&#8482;
                </MuiTypography>

                {results?.col.length || results?.row.length ? (
                    <>
                        <MuiTypography>
                            Nice! Found {foundSequences} sequences. Resetting in...{' '}
                            <CountUp
                                start={resetTime}
                                end={0}
                                duration={resetTime}
                                useEasing={false}
                            />
                        </MuiTypography>
                    </>
                ) : (
                    <MuiTypography>{message}</MuiTypography>
                )}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    flexGrow: 0,
                    gap: 4
                }}
            >
                <Box sx={{ width: '40px' }}>{loading ? <CircularProgress /> : null}</Box>
                <GridSlider
                    disabled={disabled}
                    gridSize={gridSize}
                    perfTime={perfTime}
                    onChange={handleChange}
                    onChangeGridSize={handleChangeGridSize}
                />

                <Memory performance={performance} />

                <ToolbarWorkerSwitch
                    isWorkerEnabled={isWorkerEnabled}
                    onToggleWorker={onToggleWorker}
                    onReset={onReset}
                    disabled={disabled}
                />
            </Box>
        </Box>
    );
}
