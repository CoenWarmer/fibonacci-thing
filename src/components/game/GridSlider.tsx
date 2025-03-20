import { Apps, Engineering, RestartAlt } from '@mui/icons-material';
import { Box, IconButton, Slider, Switch, Typography } from '@mui/joy';
import { ToolbarElementHeader } from './ToolbarElementHeader';

export function GridSlider({
    disabled,
    gridSize,
    isWorkerEnabled,
    onToggleWorker,
    perfTime,
    onChange,
    onChangeGridSize,
    onReset
}: {
    disabled: boolean;
    gridSize: number;
    perfTime: number | undefined;
    isWorkerEnabled: boolean;
    onToggleWorker: (enabled: boolean) => void;
    onChange: () => void;
    onChangeGridSize: (value: number) => void;
    onReset: () => void;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 300,
                backgroundColor: 'rgb(244, 250, 254)',
                padding: '12px',
                borderRadius: '8px',
                position: 'relative',
                justifyContent: 'space-between'
            }}
        >
            <Box>
                <ToolbarElementHeader icon={Apps} title="Grid size" />

                <Slider
                    disabled={disabled}
                    valueLabelDisplay="auto"
                    step={1}
                    min={5}
                    max={5000}
                    sx={{ zIndex: 9 }}
                    defaultValue={gridSize}
                    onChange={onChange}
                    onChangeCommitted={(_, value) => onChangeGridSize(value as number)}
                />
                <Typography component="p" fontSize={10} sx={{ mt: '2px' }}>
                    Current size: {gridSize} * {gridSize} ={' '}
                    {(gridSize * gridSize).toLocaleString('en-US')} cells
                    <br />
                    {perfTime === undefined ? '' : `Last render took ${perfTime} ms`}
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
                    sx={{ mt: '8px' }}
                    slotProps={{
                        endDecorator: {
                            sx: {
                                minWidth: 24
                            }
                        }
                    }}
                />
                <Typography component="p" fontSize={10} sx={{ mt: '2px' }}>
                    Use a Web Worker to generate the matrix. <br />
                    Unblocks the main thread.
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
        </Box>
    );
}
