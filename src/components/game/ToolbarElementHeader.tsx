import React from 'react';
import { Box, SvgIconTypeMap, Typography } from '@mui/joy';

export function ToolbarElementHeader({ title, icon: Icon }: { title: string; icon: any }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }}>
            <Icon fontSize="large" />
            <Typography component="h3">{title}</Typography>
        </Box>
    );
}
