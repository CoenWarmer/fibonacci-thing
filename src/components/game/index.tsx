import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { Button } from '../atoms/Button';
import { findSequenceIndicesInArray } from '../../utils/findSequenceIndicesInArray';
import { LegendLabel } from '../atoms/LegendLabel';
import CountUp from 'react-countup';

type SequenceFoundResultObj = {
    row: SequenceFoundResult[];
    col: SequenceFoundResult[];
};

type SequenceFoundResult = {
    index: number;
    sequences: {
        start: number;
        end: number;
    }[];
};

const GRID_SIZE = 50;
const SEQUENCE_LENGTH = 5;
const INITIALMATRIX = Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(0));

export function Game() {
    const [matrix, setMatrix] = useState(INITIALMATRIX);
    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();

    const handleClick = (x: number, y: number) => {
        const rows = matrix.length;
        const cols = matrix[0].length;

        const newMatrix = matrix.map((r) => [...r]);

        // Increment row values by 1
        for (let i = 0; i < rows; i++) {
            newMatrix[i][x] = matrix[i][x] + 1;
        }

        // Increment column values by 1
        for (let j = 0; j < cols; j++) {
            newMatrix[y][j] = matrix[y][j] + 1;
        }

        setMatrix(newMatrix);
    };

    const handleResetState = () => {
        setMatrix(INITIALMATRIX);
        setResults(undefined);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const checkRowsAndColsForFibonacciSequences = (matrix: number[][]) => {
            const found: SequenceFoundResultObj = {
                row: [],
                col: []
            };

            const rows = matrix.length;

            for (let i = 0; i < rows; i++) {
                // Check rows for the sequence
                const rowSequenceIndices = findSequenceIndicesInArray(matrix[i], SEQUENCE_LENGTH);

                if (rowSequenceIndices.length) {
                    found.row = found.row.concat({
                        index: i,
                        sequences: rowSequenceIndices
                    });
                }

                // Check columns for the sequence
                const column = [];

                for (let j = 0; j < matrix.length; j++) {
                    column.push(matrix[j][i]);
                }

                const columnSequenceIndices = findSequenceIndicesInArray(column, SEQUENCE_LENGTH);

                if (columnSequenceIndices.length) {
                    found.col = found.col.concat({
                        index: i,
                        sequences: columnSequenceIndices
                    });
                }
            }

            return found;
        };

        const result = checkRowsAndColsForFibonacciSequences(matrix);

        setResults(result);

        if (result.col.length || result.row.length) {
            confetti({
                particleCount: 300,
                spread: 200,
                origin: { x: 0.5, y: 0.5 }
            });

            // Now that we have results, we need to clear them after 5 seconds.
            // Start building a cleaned matrix
            const newMatrix = matrix.map((r) => [...r]);

            // Taking the results object, fill the matrix with 0s
            for (let rowIndex = 0; rowIndex < result.row.length; rowIndex++) {
                const row = result.row[rowIndex];

                for (let sequenceIndex = 0; sequenceIndex < row.sequences.length; sequenceIndex++) {
                    const sequence = row.sequences[sequenceIndex];

                    for (let i = sequence.start; i <= sequence.end; i++) {
                        newMatrix[row.index][i] = 0;
                    }
                }
            }

            for (let colIndex = 0; colIndex < result.col.length; colIndex++) {
                const column = result.col[colIndex];

                for (
                    let sequenceIndex = 0;
                    sequenceIndex < column.sequences.length;
                    sequenceIndex++
                ) {
                    const sequence = column.sequences[sequenceIndex];

                    for (let i = sequence.start; i <= sequence.end; i++) {
                        newMatrix[i][column.index] = 0;
                    }
                }
            }

            // Clear results on a timeout
            timer = setTimeout(() => {
                setMatrix(newMatrix);
                setResults(undefined);
            }, 5000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [matrix]);

    function isPartOfSequence(
        x: number,
        y: number,
        results: SequenceFoundResultObj | undefined = undefined
    ) {
        if (!results) {
            return false;
        }

        return (
            isCoordinateInSequence(results.row, x, y) || isCoordinateInSequence(results.col, y, x)
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: 20 }}>
                <Button
                    value={
                        <>
                            Reset
                            <RestartAltIcon />
                        </>
                    }
                    big
                    onClick={handleResetState}
                />
            </div>

            {results?.col.length || results?.row.length ? (
                <CountUp start={5} end={0} duration={5} useEasing={false} />
            ) : null}

            <div style={{ display: 'flex' }}>
                {matrix.map((_, y) => (
                    <LegendLabel label={y} key={y} />
                ))}
            </div>

            {matrix.map((col, y) => (
                <div key={y}>
                    <div style={{ position: 'absolute', marginLeft: -22, marginTop: 4 }}>
                        <LegendLabel label={y} />
                    </div>

                    {col.map((cell: number, x: number) => (
                        <Button
                            key={x}
                            value={cell}
                            active={isPartOfSequence(x, y, results)}
                            onClick={() => handleClick(x, y)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

function isCoordinateInSequence(foundSequences: SequenceFoundResult[], x: number, y: number) {
    for (const rowResult of foundSequences) {
        if (rowResult.index === y) {
            for (const sequence of rowResult.sequences) {
                if (x >= sequence.start && x <= sequence.end) {
                    return true;
                }
            }
        }
    }
}
