import { Box, Slider, Typography } from '@mui/joy';

export function GridSlider({
    gridSize,
    onChange,
    onChangeGridSize
}: {
    gridSize: number;
    onChange: () => void;
    onChangeGridSize: (value: number) => void;
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 300 }}>
            <Typography component="h3">Grid Size</Typography>
            <Slider
                valueLabelDisplay="auto"
                step={1}
                min={5}
                max={5000}
                defaultValue={gridSize}
                onChange={onChange}
                onChangeCommitted={(_, value) => onChangeGridSize(value as number)}
            />
            <Typography component="p" fontSize={10}>
                Current size: {gridSize} * {gridSize} ={' '}
                {(gridSize * gridSize).toLocaleString('en-US')} cells
            </Typography>
        </Box>
    );
}
