import { Box } from '@mui/joy';
import { SxProps } from '@mui/system';

export function ElementContainer({ children, sx }: { children: React.ReactNode; sx?: SxProps }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: {
                    xs: '100%',
                    md: 300
                },
                backgroundColor: 'rgb(244, 250, 254)',
                padding: '12px',
                borderRadius: '8px',
                position: 'relative',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                ...sx
            }}
        >
            {children}
        </Box>
    );
}
