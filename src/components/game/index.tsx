import { CSSProperties, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { AutoSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { Legend } from './Legend';
import { Button } from '../atoms/Button';
import {
    checkRowsAndColsForFibonacciSequences,
    isPartOfSequence,
    type SequenceFoundResultObj
} from '../../utils/sequences';
import { Toolbar } from './Toolbar';
import { estimateMatrixMemoryUsage, Matrix } from './Matrix';
import { Alert, Box, Typography } from '@mui/joy';

const INITIAL_GRID_SIZE = 50;
const SEQUENCE_LENGTH = 5;
const RESET_TIME_IN_SECONDS = 5;

export function Game() {
    const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');

    const matrix = useRef<Matrix | undefined>(undefined);

    // First we check the memory usage of the matrix
    useEffect(() => {
        const memory = (performance as any)?.memory;
        if (memory) {
            if (estimateMatrixMemoryUsage(gridSize, gridSize) > memory.usedJSHeapSize) {
                setError('Matrix will not fit in memory.');
            } else {
                matrix.current = new Matrix(gridSize, gridSize);
            }
        } else {
            console.log('performance.memory is not available in this browser.');
            setError(
                'This app needs a browser that supports performance.memory to determine whether or not the matrix object will fit in memory. Please use a V8 based browser.'
            );
        }
    }, [gridSize]);

    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();
    const [disabled, setDisabled] = useState(false);

    const handleClick = (x: number, y: number) => {
        if (matrix.current === undefined) {
            return;
        }

        matrix.current?.increment(x, y);

        setCount(count + 1);
    };

    const handleChangeGridSize = (newGridSize: number) => {
        matrix.current = new Matrix(newGridSize, newGridSize);
        setGridSize(newGridSize);
        setResults(undefined);
        setCount(count + 1);
    };

    const handleResetState = () => {
        matrix.current = new Matrix(gridSize, gridSize);
        setCount(count + 1);
        setResults(undefined);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (matrix.current === undefined) {
            return;
        }

        const result = checkRowsAndColsForFibonacciSequences(matrix.current, SEQUENCE_LENGTH);

        setResults(result);

        // We got some hits y'all
        if (result.col.length || result.row.length) {
            setDisabled(true);

            confetti({
                particleCount: 300,
                spread: 200,
                origin: { x: 0.5, y: 0.5 }
            });

            // Clear results on a timeout
            timer = setTimeout(() => {
                matrix.current?.clearSequencesFromResultObject(result);
                setResults(undefined);
                setCount(count + 1);
                setDisabled(false);
            }, RESET_TIME_IN_SECONDS * 1000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [matrix, count]);

    return (
        <>
            <Toolbar
                disabled={matrix.current === undefined}
                results={results}
                resetTime={RESET_TIME_IN_SECONDS}
                performance={performance}
                initialGridSize={gridSize}
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
                        <Typography level="title-md">Incorrect browser</Typography>
                        <Typography level="body-md">{error}</Typography>
                    </Box>
                </Alert>
            ) : matrix ? (
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
            ) : null}
        </>
    );
}
