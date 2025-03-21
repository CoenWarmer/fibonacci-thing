import { Box } from '@mui/joy';

export function ElementContainer({ children }: { children: React.ReactNode }) {
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
                boxSizing: 'border-box'
            }}
        >
            {children}
        </Box>
    );
}
