import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import confetti from 'canvas-confetti';

import { Legend } from './Legend';
import { Button } from '../atoms/Button';
import {
    checkRowsAndColsForFibonacciSequences,
    isPartOfSequence,
    type SequenceFoundResultObj
} from '../../utils/sequences';
import { Toolbar } from './Toolbar';
import { estimateMatrixMemoryUsage, Matrix } from './Matrix';

const GRID_SIZE = 1000;
const SEQUENCE_LENGTH = 5;
const RESET_TIME_IN_SECONDS = 5;

export function Game() {
    const [count, setCount] = useState(0);
    const [error, setError] = useState('');
    const [matrix, setMatrix] = useState<Matrix | undefined>();

    // First we check the memory usage of the matrix
    useEffect(() => {
        const memory = (performance as any).memory;
        if (memory) {
            if (estimateMatrixMemoryUsage(GRID_SIZE, GRID_SIZE) > memory.usedJSHeapSize) {
                setError('Matrix will not fit in memory.');
            } else {
                setMatrix(new Matrix(GRID_SIZE, GRID_SIZE));
            }
        } else {
            console.log('performance.memory is not available in this browser.');
            setError(
                'We need a browser that supports performance.memory to determine whether or not the matrix object will fit in memory.'
            );
        }

        estimateMatrixMemoryUsage(GRID_SIZE, GRID_SIZE);
    }, []);

    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();
    const [disabled, setDisabled] = useState(false);

    const handleClick = (x: number, y: number) => {
        if (matrix === undefined) {
            return;
        }

        matrix.increment(x, y);

        setCount(count + 1);
    };

    const handleResetState = () => {
        const newMatrix = new Matrix(GRID_SIZE, GRID_SIZE);
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

    return (
        <div>
            <Toolbar
                results={results}
                resetTime={RESET_TIME_IN_SECONDS}
                performance={performance}
                onReset={handleResetState}
            />

            {/* <Legend size={GRID_SIZE} /> */}

            {error ? (
                <div>{error}</div>
            ) : matrix ? (
                <Grid
                    autoContainerWidth
                    autoWidth
                    containerStyle={{ overflow: 'scroll' }}
                    cellRenderer={({ columnIndex, rowIndex }) => (
                        <Button
                            key={`${rowIndex}-${columnIndex}`}
                            value={
                                <>
                                    {/* r: {rowIndex}, c: {columnIndex} -  */}

                                    {matrix?.get(rowIndex, columnIndex)}
                                </>
                            }
                            row={rowIndex}
                            col={columnIndex}
                            disabled={disabled}
                            active={isPartOfSequence(columnIndex, rowIndex, results)}
                            onClick={() => handleClick(columnIndex, rowIndex)}
                        />
                    )}
                    columnWidth={22}
                    rowHeight={22}
                    columnCount={50}
                    rowCount={50}
                    width={1150}
                    height={1150}
                    autoHeight
                />
            ) : null}
        </div>
    );
}
