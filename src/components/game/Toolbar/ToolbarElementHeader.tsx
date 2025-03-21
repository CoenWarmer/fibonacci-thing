import { Box, Typography } from '@mui/joy';

export function ToolbarElementHeader({
    title,
    icon: Icon,
    component
}: {
    title: string;
    icon: any;
    component?: React.ReactElement;
}) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
            <Icon fontSize="large" />
            <Typography component="h3">{title}</Typography>
            {component}
        </Box>
    );
}
