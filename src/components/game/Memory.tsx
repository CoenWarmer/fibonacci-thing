import { MemoryOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { ToolbarElementHeader } from './ToolbarElementHeader';

type V8Memory = {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
};

export type BrowserPerformance = {
    memory: V8Memory;
};

export function Memory({ performance }: { performance: BrowserPerformance }) {
    const [stateMemory, setStateMemory] = useState<V8Memory | undefined>();

    useEffect(() => {
        setStateMemory(performance.memory);
    }, []);

    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = stateMemory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
    };

    const relativeMemUsage = stateMemory
        ? Math.floor((usedJSHeapSize / stateMemory.totalJSHeapSize) * 100)
        : 0;

    return stateMemory ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <ToolbarElementHeader icon={MemoryOutlined} title="Memory" />

            <Box
                sx={{
                    display: 'flex',
                    position: 'relative',
                    width: '300px',
                    height: '36px',
                    border: 'solid 2px rgb(221, 231, 238)',
                    borderRadius: '6px',
                    mt: '8px'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        width: `${relativeMemUsage}%`,
                        alignItems: 'center',
                        background:
                            relativeMemUsage < 25
                                ? 'green'
                                : relativeMemUsage < 80
                                  ? 'yellow'
                                  : 'red',
                        padding: '6px 4px',
                        borderRadius: '4px 0 0 4px ',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '12px',
                            color:
                                relativeMemUsage < 25
                                    ? 'white'
                                    : relativeMemUsage < 80
                                      ? 'black'
                                      : 'white'
                        }}
                    >
                        In use: {Math.floor(usedJSHeapSize / (1024 * 1024))} MB
                    </Typography>

                    <Typography sx={{ position: 'absolute', fontSize: '10px', right: 4 }}>
                        Current heap size:
                        {Math.floor(totalJSHeapSize / (1024 * 1024))} MB
                    </Typography>
                </Box>
            </Box>

            <Typography component="p" fontSize={10} sx={{ mt: '4px' }}>
                Max heap available on system: {Math.ceil(jsHeapSizeLimit / (1024 * 1024 * 1024))} GB
                <br />
                Currently allocated heap is {Math.floor((totalJSHeapSize / jsHeapSizeLimit) * 100)}%
                of the total available heap size
            </Typography>
        </Box>
    ) : null;
}
