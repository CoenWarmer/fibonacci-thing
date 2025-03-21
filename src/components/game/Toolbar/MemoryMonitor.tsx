import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MemoryOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/joy';

import { ToolbarElementHeader } from './ToolbarElementHeader';
import { ElementContainer } from './ElementContainer';

type V8Memory = {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
};

export type BrowserPerformance = {
    memory: V8Memory;
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function MemoryMonitor({
    gridSize,
    performance
}: {
    gridSize: number;
    performance: BrowserPerformance;
}) {
    const [stateMemory, setStateMemory] = useState<V8Memory | undefined>();

    const [memoryUsage, setMemoryUsage] = useState<
        Array<{ gridSize: number; used: number; heapLimit: number }>
    >([]);

    useEffect(() => {
        if (memoryUsage.find((item) => item.gridSize === gridSize)) {
            return;
        }

        if (performance && performance.memory && performance.memory.usedJSHeapSize) {
            setMemoryUsage(
                memoryUsage.concat({
                    gridSize,
                    used: Math.floor(performance.memory.usedJSHeapSize / 1024 / 1024),
                    heapLimit: Math.floor(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                })
            );

            setStateMemory(performance.memory);
        }
    }, [gridSize, performance?.memory?.usedJSHeapSize]);

    const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = stateMemory || {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0
    };

    // const relativeMemUsage = stateMemory
    //     ? Math.floor((usedJSHeapSize / stateMemory.totalJSHeapSize) * 100)
    //     : 0;

    const data = {
        labels: memoryUsage.map((item) => `${item.gridSize} cells`),
        datasets: [
            {
                label: 'Memory usage (MB)',
                data: memoryUsage.map((item) => item.used || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                barThickness: 12
            }
        ]
    };

    return (
        <ElementContainer
            sx={{
                maxWidth: {
                    xs: '100%',
                    md: 300
                }
            }}
        >
            <ToolbarElementHeader
                icon={MemoryOutlined}
                title={`Memory usage (${Math.floor(usedJSHeapSize / (1024 * 1024))} MB)`}
            />
            <Box sx={{ mb: '3px' }} />
            {/* <Box
                sx={{
                    display: 'flex',
                    position: 'relative',
                    width: '300px',
                    height: '36px',
                    border: 'solid 2px rgb(221, 231, 238)',
                    borderRadius: '6px',
                    mt: '8px',
                    background: '#fff'
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
                        padding: '0 8px',
                        borderRadius: '4px 0 0 4px ',
                        transition: 'all 0.3s ease-in-out'
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '12px',
                            fontWeight: 'bold',
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

                    <Typography sx={{ position: 'absolute', fontSize: '10px', right: '8px' }}>
                        Current heap size:
                        {Math.floor(totalJSHeapSize / (1024 * 1024))} MB
                    </Typography>
                </Box>
            </Box> */}

            <Bar
                options={{
                    responsive: true,
                    animation: false,
                    plugins: {
                        filler: {
                            propagate: true
                        },
                        legend: {
                            display: false,
                            position: 'bottom' as const
                        }
                    },
                    scales: {
                        y: {
                            ticks: {
                                callback: (value) => `${value} MB`
                            }
                        }
                    }
                }}
                data={data}
            />

            <Typography component="p" fontSize={10} sx={{ mt: '4px' }}>
                Max heap available on system: {Math.ceil(jsHeapSizeLimit / (1024 * 1024 * 1024))} GB
                <br />
                Currently allocated heap is {Math.floor((totalJSHeapSize / jsHeapSizeLimit) * 100)}%
                of the total available heap size
            </Typography>
        </ElementContainer>
    );
}
