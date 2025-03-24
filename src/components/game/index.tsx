'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AutoSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { Button } from '../atoms/Button';
import {
    checkRowsAndColsForFibonacciSequences,
    isPartOfSequence,
    type SequenceFoundResultObj
} from '../../utils/sequences';
import { Toolbar } from './Toolbar/Toolbar';
import { estimateMatrixMemoryUsage, Matrix } from './Matrix/Matrix';
import { Alert, Box, Typography } from '@mui/joy';
import { ElementContainer } from './Toolbar/ElementContainer';
import { MatrixWorker, MatrixWorkerResponse } from './Matrix/matrix.worker';

const INITIAL_GRID_SIZE = 50;
const SEQUENCE_LENGTH = 5;
const RESET_TIME_IN_SECONDS = 5;

export function Game() {
    const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);

    const [count, setCount] = useState(0); // As we're side-stepping React's state management, we need a mechanism to force a re-render

    const [error, setError] = useState('');

    const [isWorkerEnabled, setIsWorkerEnabled] = useState<boolean | undefined>(undefined);

    const matrix = useRef<Matrix | undefined>(undefined);
    const matrixWorker = useRef<MatrixWorker>(undefined);

    const [loading, setLoading] = useState(false);

    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();
    const [disabled, setDisabled] = useState(false);

    const renderDuration = useRef<PerformanceMeasure | undefined>(undefined);

    // First we check the memory usage of the matrix
    useEffect(() => {
        const memory = (performance as any)?.memory;
        if (!memory) {
            console.log('performance.memory is not available in this browser.');
            setError(
                'This app needs a browser that supports performance.memory to determine whether or not the matrix object will fit in memory. Please use a V8 based browser.'
            );

            return;
        }

        // So we got memory usage checks in the browser
        if (estimateMatrixMemoryUsage(gridSize, gridSize) > memory.usedJSHeapSize) {
            setError('Matrix will not fit in memory.');
            return;
        }

        if (!window.Worker || isWorkerEnabled === false) {
            createMatrixWithoutWorker(gridSize);
            return;
        }

        // We got web worker support, so enable it by default
        if (isWorkerEnabled === undefined) {
            setIsWorkerEnabled(true);

            if (!matrixWorker.current) {
                setupWorker();
            }
        }

        createMatrixWithWorker(gridSize);
    }, [gridSize]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (matrix.current === undefined) {
            return;
        }

        if (results?.col.length || results?.row.length) {
            timer = setTimeout(() => {
                setDisabled(true);

                confetti({
                    particleCount: 300,
                    spread: 200,
                    origin: { x: 0.5, y: 0.5 }
                });
            }, 0);

            // Clear results on a timeout
            timer = setTimeout(() => {
                matrix.current?.clearSequencesFromResultObject(results);
                setResults(undefined);
                setCount(count + 1);
                setDisabled(false);
                setLoading(false);
            }, RESET_TIME_IN_SECONDS * 1000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [count, results]);

    // Clean the worker when unmounting the component
    useEffect(() => {
        return () => {
            removeWorker();
        };
    }, []);

    const handleClick = (x: number, y: number) => {
        if (matrix.current === undefined) {
            return;
        }

        setLoading(true);

        matrix.current?.increment(x, y);

        checkMatrix();
        setCount(count + 1);
    };

    const handleChangeGridSize = (newGridSize: number) => {
        createMatrix(newGridSize);
        setGridSize(newGridSize);
        setResults(undefined);
        setCount(count + 1);
    };

    const handleResetState = () => {
        createMatrix(INITIAL_GRID_SIZE);
        setGridSize(INITIAL_GRID_SIZE);
        setCount(count + 1);
        setResults(undefined);
    };

    const handleToggleWorker = (isEnabled: boolean) => {
        if (isEnabled) {
            setupWorker();
        } else {
            removeWorker();
        }
        setIsWorkerEnabled(isEnabled);
    };

    const createMatrix = (newGridSize: number) => {
        if (matrixWorker.current && isWorkerEnabled) {
            createMatrixWithWorker(newGridSize);
        } else {
            createMatrixWithoutWorker(newGridSize);
        }
    };

    const createMatrixWithWorker = (newGridSize: number) => {
        if (matrixWorker.current) {
            matrixWorker.current.postMessage({
                type: 'generateMatrix',
                options: { gridSize: newGridSize }
            });
        }
    };

    const createMatrixWithoutWorker = (newGridSize: number) => {
        matrix.current = new Matrix(newGridSize, newGridSize, { prefillArray: true });
    };

    const checkMatrix = () => {
        if (!matrix.current) return;

        if (isWorkerEnabled && matrixWorker.current) {
            matrixWorker.current.postMessage({
                type: 'checkMatrix',
                options: {
                    gridSize,
                    sequenceLength: SEQUENCE_LENGTH,
                    data: matrix.current.data.buffer
                }
            });
        } else {
            setResults(checkRowsAndColsForFibonacciSequences(matrix.current, SEQUENCE_LENGTH));
            setDisabled(false);
            setLoading(false);
        }
    };

    const setupWorker = () => {
        if (matrixWorker.current) return; // Worker is already set up.

        const worker = new Worker(
            new URL('./Matrix/matrix.worker', import.meta.url)
        ) as MatrixWorker;
        matrixWorker.current = worker;

        matrixWorker.current.addEventListener('message', handleWorkerResponse);
    };

    const handleWorkerResponse = (event: MessageEvent<MatrixWorkerResponse>) => {
        const { type } = event.data;

        if (type === 'generateMatrix') {
            const { gridSize, arrayData } = event.data.response;

            // Reconstruct the Matrix instance from the serialized data
            const newlyCreatedMatrix = new Matrix(gridSize, gridSize, {
                prefillArray: false
            });
            newlyCreatedMatrix.data = new Float32Array(arrayData); // Restore the Float32Array data

            matrix.current = newlyCreatedMatrix;

            setCount(count + 1);
            setLoading(false);
            setDisabled(false);
        }

        if (type === 'checkMatrix') {
            const { result } = event.data.response;

            setResults(result);
            setCount(count + 1);
            setLoading(false);
            setDisabled(false);
        }

        if (type === 'checkMatrixProgress') {
            setLoading(event.data.response.loading);
        }
    };

    const removeWorker = () => {
        if (!matrixWorker.current) return;

        matrixWorker.current.terminate();
        matrixWorker.current = undefined;
    };

    // Render time checking
    performance.mark('start-render');

    useEffect(() => {
        performance.mark('component-settled');
        renderDuration.current = performance.measure(
            'Render Duration',
            'start-render',
            'component-settled'
        );
    });

    return (
        <>
            <Toolbar
                disabled={matrix.current === undefined}
                results={results}
                resetTime={RESET_TIME_IN_SECONDS}
                performance={performance}
                initialGridSize={gridSize}
                isWorkerEnabled={Boolean(isWorkerEnabled)}
                loading={loading}
                perfTime={
                    renderDuration.current !== undefined
                        ? Math.floor(renderDuration.current.duration)
                        : undefined
                }
                onSetLoading={setLoading}
                onToggleWorker={handleToggleWorker}
                onChangeGridSize={handleChangeGridSize}
                onReset={handleResetState}
            />
            <Box sx={{ display: 'flex', height: 20 }} />

            {error ? (
                <Alert
                    variant="soft"
                    color="danger"
                    invertedColors
                    sx={{ alignItems: 'flex-start', gap: '1rem' }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography level="title-md">Error</Typography>
                        <Typography level="body-md">{error}</Typography>
                    </Box>
                </Alert>
            ) : matrix.current ? (
                <ElementContainer>
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <Grid
                                width={width}
                                height={300}
                                rowHeight={22}
                                columnWidth={22}
                                rowCount={gridSize}
                                columnCount={gridSize}
                                cellRenderer={({
                                    columnIndex,
                                    rowIndex,
                                    style
                                }: {
                                    columnIndex: number;
                                    rowIndex: number;
                                    style: CSSProperties;
                                }) => (
                                    <Button
                                        key={`${rowIndex}-${columnIndex}`}
                                        value={<>{matrix.current?.get(rowIndex, columnIndex)}</>}
                                        row={rowIndex}
                                        col={columnIndex}
                                        disabled={disabled}
                                        style={style}
                                        active={isPartOfSequence(columnIndex, rowIndex, results)}
                                        onClick={() => handleClick(rowIndex, columnIndex)}
                                    />
                                )}
                                containerStyle={{
                                    display: 'flex',
                                    backgroundColor: 'rgb(221, 231, 238)'
                                }}
                            />
                        )}
                    </AutoSizer>
                </ElementContainer>
            ) : null}
        </>
    );
}
