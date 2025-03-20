import { Apps } from '@mui/icons-material';
import { Box, Slider, Typography } from '@mui/joy';
import { ToolbarElementHeader } from './ToolbarElementHeader';

export function GridSlider({
    disabled,
    gridSize,
    perfTime,
    onChange,
    onChangeGridSize
}: {
    disabled: boolean;
    gridSize: number;
    perfTime: number | undefined;
    onChange: () => void;
    onChangeGridSize: (value: number) => void;
}) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 300,
                backgroundColor: 'rgb(244, 250, 254)',
                padding: '12px',
                borderRadius: '8px'
            }}
        >
            <ToolbarElementHeader icon={Apps} title="Grid size" />

            <Slider
                disabled={disabled}
                valueLabelDisplay="auto"
                step={1}
                min={5}
                max={5000}
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
    );
}
