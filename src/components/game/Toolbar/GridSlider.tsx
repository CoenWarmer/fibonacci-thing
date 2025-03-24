import { Apps, Engineering, RestartAlt } from '@mui/icons-material';
import { Box, CircularProgress, IconButton, Slider, Switch, Typography } from '@mui/joy';
import { ToolbarElementHeader } from './ToolbarElementHeader';
import { ElementContainer } from './ElementContainer';
import { useEffect, useState } from 'react';

export function GridSlider({
    disabled,
    gridSize,
    isWorkerEnabled,
    loading,
    perfTime,
    onChange,
    onChangeGridSize,
    onReset,
    onToggleWorker
}: {
    disabled: boolean;
    gridSize: number;
    isWorkerEnabled: boolean;
    loading: boolean;
    perfTime: number[] | undefined;
    onChange: () => void;
    onChangeGridSize: (value: number) => void;
    onReset: () => void;
    onToggleWorker: (enabled: boolean) => void;
}) {
    const [initialGridSize, setInitialGridSize] = useState(gridSize);

    useEffect(() => {
        if (initialGridSize !== gridSize) {
            setInitialGridSize(gridSize);
        }
    }, [gridSize]);

    return (
        <ElementContainer
            sx={{
                maxWidth: {
                    xs: '100%',
                    md: 300
                }
            }}
        >
            <Box>
                <ToolbarElementHeader
                    icon={Apps}
                    title={`Grid size (${gridSize})`}
                    component={
                        <Box sx={{ width: '20px', height: '20px' }}>
                            {loading ? (
                                <CircularProgress
                                    sx={{
                                        '--CircularProgress-size': '20px',
                                        '--_progress-thickness': '2px'
                                    }}
                                />
                            ) : null}
                        </Box>
                    }
                />

                <Slider
                    disabled={disabled}
                    valueLabelDisplay="auto"
                    step={1}
                    min={5}
                    max={5000}
                    sx={{ zIndex: 9 }}
                    defaultValue={gridSize}
                    key={gridSize}
                    onChange={onChange}
                    onChangeCommitted={(_, value) => onChangeGridSize(value as number)}
                />
                <Typography component="p" fontSize={10} sx={{ mt: '2px' }}>
                    Current size: {gridSize} * {gridSize} ={' '}
                    {(gridSize * gridSize).toLocaleString('en-US')} cells
                    <br />
                    {perfTime === undefined
                        ? ''
                        : `Last render took ${perfTime[0]} ms. Last check took ${perfTime[1]} ms.`}
                </Typography>
            </Box>

            <Box sx={{ mt: '16px' }}>
                <ToolbarElementHeader icon={Engineering} title="Web Worker" />
                <Switch
                    checked={isWorkerEnabled}
                    onChange={(event) => onToggleWorker(event.target.checked)}
                    disabled={disabled}
                    color={isWorkerEnabled ? 'success' : 'neutral'}
                    variant={isWorkerEnabled ? 'solid' : 'outlined'}
                    endDecorator={isWorkerEnabled ? 'On' : 'Off'}
                    sx={{ mt: '8px', mb: '8px' }}
                    slotProps={{
                        endDecorator: {
                            sx: {
                                minWidth: 24
                            }
                        }
                    }}
                />
                <Typography component="p" fontSize={10} sx={{ mt: '2px' }}>
                    Use a Web Worker to generate and check the matrix for sequences. Unblocks the
                    main thread.
                </Typography>
            </Box>

            <Box sx={{ position: 'absolute', top: '8px', right: '8px' }}>
                <IconButton
                    disabled={disabled}
                    color="primary"
                    variant="soft"
                    size="sm"
                    sx={{ padding: '8px 10px', gap: '4px' }}
                    onClick={onReset}
                >
                    Reset
                    <RestartAlt />
                </IconButton>
            </Box>
        </ElementContainer>
    );
}
