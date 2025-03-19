import { Box, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';

export type V8Performance = {
    memory: {
        totalJSHeapSize: number;
        usedJSHeapSize: number;
        jsHeapSizeLimit: number;
    };
};

export function Memory({ performance }: { performance: V8Performance }) {
    const [statePerformance, setStatePerformance] = useState<V8Performance | undefined>();

    useEffect(() => {
        setStatePerformance(performance);
    }, []);

    const relativeMemUsage = statePerformance
        ? Math.floor(
              (statePerformance?.memory?.usedJSHeapSize /
                  statePerformance?.memory.totalJSHeapSize) *
                  100
          )
        : 0;

    return statePerformance ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '81px' }}>
            <Typography component="h3" sx={{ mb: 1 }}>
                Memory
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    position: 'relative',
                    width: '300px',
                    height: '20px',
                    border: 'solid 1px rgb(221, 231, 238)',
                    borderRadius: '6px'
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
                        borderRadius: '6px 0 0 6px ',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <Typography sx={{ fontSize: '10px', color: 'white' }}>
                        In use: {Math.floor(performance?.memory?.usedJSHeapSize / (1024 * 1024))} MB
                    </Typography>

                    <Typography sx={{ position: 'absolute', fontSize: '10px', right: 4 }}>
                        Current heap size:
                        {Math.floor(performance?.memory?.totalJSHeapSize / (1024 * 1024))} MB
                    </Typography>
                </Box>
            </Box>
            <Typography component="p" fontSize={10} sx={{ mt: 1 }}>
                Max heap available on system:{' '}
                {Math.ceil(statePerformance.memory?.jsHeapSizeLimit / (1024 * 1024 * 1024))} GB
                <br />
                Currently allocated heap is{' '}
                {Math.floor(
                    (statePerformance?.memory?.totalJSHeapSize /
                        statePerformance?.memory.jsHeapSizeLimit) *
                        100
                )}
                % of the total available heap size
            </Typography>
        </Box>
    ) : null;
}
