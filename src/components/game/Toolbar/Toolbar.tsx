import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

import { Box } from '@mui/joy';
import MuiTypography from '@mui/joy/Typography';

import { GridSlider } from './GridSlider';
import { MemoryMonitor } from './MemoryMonitor';
import { getTotalSequences, SequenceFoundResultObj } from '../../../utils/sequences';
import { Pattern } from '@mui/icons-material';

export function Toolbar({
    disabled,
    results,
    resetTime,
    performance,
    perfTime,
    initialGridSize,
    isWorkerEnabled,
    loading,
    onChangeGridSize,
    onSetLoading,
    onToggleWorker,
    onReset
}: {
    disabled: boolean;
    results: SequenceFoundResultObj | undefined;
    resetTime: number;
    initialGridSize: number;
    isWorkerEnabled: boolean;
    loading: boolean;
    performance?: any;
    perfTime: number | undefined;
    onChangeGridSize: (gridSize: number) => void;
    onSetLoading: (loading: boolean) => void;
    onToggleWorker: (enabled: boolean) => void;
    onReset: () => void;
}) {
    const [gridSize, setGridSize] = useState(initialGridSize);
    const [message, setMessage] = useState('Click on the grid to create a fibonacci sequence.');

    const foundSequences = getTotalSequences(results);

    const handleChangeGridSize = (newGridSize: number) => {
        setGridSize(newGridSize);
        onChangeGridSize(newGridSize);
        onSetLoading(true);
    };

    const handleChange = () => {
        onSetLoading(true);
    };

    const handleReset = () => {
        onSetLoading(true);
        onReset();
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
        if (initialGridSize !== gridSize) {
            setGridSize(initialGridSize);
        }
    }, [initialGridSize]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '80px 0 30px',

                flexDirection: {
                    xs: 'column',
                    md: 'row'
                },

                textAlign: {
                    xs: 'center',
                    md: 'left'
                }
            }}
        >
            <Box
                sx={{
                    mr: 2,
                    mb: { xs: 6, md: 0 }
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
                    gap: {
                        xs: 2,
                        md: 4
                    },

                    flexDirection: {
                        xs: 'column',
                        md: 'row'
                    }
                }}
            >
                <GridSlider
                    disabled={disabled}
                    loading={loading}
                    gridSize={gridSize}
                    isWorkerEnabled={isWorkerEnabled}
                    perfTime={perfTime}
                    onToggleWorker={onToggleWorker}
                    onChange={handleChange}
                    onChangeGridSize={handleChangeGridSize}
                    onReset={handleReset}
                />

                <MemoryMonitor gridSize={gridSize} performance={performance} />
            </Box>
        </Box>
    );
}
