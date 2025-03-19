import { CSSProperties, useEffect, useState } from 'react';
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
import { Box } from '@mui/joy';

const INITIAL_GRID_SIZE = 1000;
const SEQUENCE_LENGTH = 5;
const RESET_TIME_IN_SECONDS = 5;

export function Game() {
    const [gridSize, setGridSize] = useState(INITIAL_GRID_SIZE);
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');
    const [matrix, setMatrix] = useState<Matrix | undefined>();

    // First we check the memory usage of the matrix
    useEffect(() => {
        const memory = (performance as any).memory;
        if (memory) {
            if (estimateMatrixMemoryUsage(gridSize, gridSize) > memory.usedJSHeapSize) {
                setError('Matrix will not fit in memory.');
            } else {
                setMatrix(new Matrix(gridSize, gridSize));
            }
        } else {
            console.log('performance.memory is not available in this browser.');
            setError(
                'We need a browser that supports performance.memory to determine whether or not the matrix object will fit in memory.'
            );
        }
    }, [gridSize]);

    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();
    const [disabled, setDisabled] = useState(false);

    const handleClick = (x: number, y: number) => {
        if (matrix === undefined) {
            return;
        }

        matrix.increment(x, y);

        setCount(count + 1);
    };

    const handleChangeGridSize = (newGridSize: number) => {
        console.log('newGridSize', newGridSize);
        const newMatrix = new Matrix(newGridSize, newGridSize);
        setMatrix(newMatrix);
        setGridSize(newGridSize);
        setResults(undefined);
        setCount(count + 1);
    };

    const handleResetState = () => {
        const newMatrix = new Matrix(gridSize, gridSize);
        setMatrix(newMatrix);
        setResults(undefined);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (matrix === undefined) {
            return;
        }

        const result = checkRowsAndColsForFibonacciSequences(matrix, SEQUENCE_LENGTH);

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
                matrix.clearSequencesFromResultObject(result);
                setResults(undefined);
                setDisabled(false);
            }, RESET_TIME_IN_SECONDS * 1000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [matrix, count]);

    const renderBodyCell = ({
        columnIndex,
        rowIndex,
        style
    }: {
        columnIndex: number;
        rowIndex: number;
        style: CSSProperties;
    }) => {
        return (
            <Button
                key={`${rowIndex}-${columnIndex}`}
                value={<>{matrix?.get(rowIndex, columnIndex)}</>}
                row={rowIndex}
                col={columnIndex}
                disabled={disabled}
                style={style}
                active={isPartOfSequence(columnIndex, rowIndex, results)}
                onClick={() => handleClick(rowIndex, columnIndex)}
            />
        );
    };

    return (
        <div>
            <Toolbar
                results={results}
                resetTime={RESET_TIME_IN_SECONDS}
                performance={performance}
                initialGridSize={gridSize}
                onChangeGridSize={handleChangeGridSize}
                onReset={handleResetState}
            />

            <Box sx={{ display: 'flex', height: 20 }} />

            {error ? (
                <div>{error}</div>
            ) : matrix ? (
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <Grid
                            cellRenderer={renderBodyCell}
                            columnWidth={22}
                            columnCount={gridSize}
                            height={300}
                            rowHeight={22}
                            rowCount={gridSize}
                            width={width}
                            containerStyle={{ display: 'flex' }}
                        />
                    )}
                </AutoSizer>
            ) : null}
        </div>
    );
}
