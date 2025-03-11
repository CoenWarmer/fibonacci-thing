import { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';

type SequenceFoundResultObj = {
    row: SequenceFoundResult[];
    col: SequenceFoundResult[];
};

type SequenceFoundResult = {
    index: number;
    startElement: number;
    endElement: number;
};

const GRID_SIZE = 20;
const FIBONACCI_SEQUENCE = [0, 1, 1, 2, 3];

const initialMatrix = Array(GRID_SIZE).fill(Array(GRID_SIZE).fill(0));

export function Game() {
    const [matrix, setMatrix] = useState(initialMatrix);

    const [results, setResults] = useState<SequenceFoundResultObj | undefined>();

    const handleClick = (row: number, col: number) => {
        const rows = matrix.length;
        const cols = matrix[0].length;

        const newMatrix = matrix.map((r) => [...r]);

        // Increment row values by 1
        for (let j = 0; j < cols; j++) {
            newMatrix[row][j] = matrix[row][j] + 1;
        }

        // Increment column values by 1
        for (let i = 0; i < rows; i++) {
            newMatrix[i][col] = matrix[i][col] + 1;
        }

        setMatrix(newMatrix);
    };

    useEffect(() => {
        let timer: NodeJS.Timeout;
        const checkRowsAndColsForFibonacci = (matrix: number[][]) => {
            const found: SequenceFoundResultObj = {
                row: [],
                col: []
            };

            const rows = matrix.length;

            for (let i = 0; i < rows; i++) {
                // Check rows for the sequence
                let firstFoundRowElement = findSequenceIndexInArray(matrix[i]);

                if (firstFoundRowElement !== -1) {
                    found.row = found.row.concat({
                        index: i,
                        startElement: firstFoundRowElement,
                        endElement: firstFoundRowElement + FIBONACCI_SEQUENCE.length - 1
                    });
                }

                // Check columns for the sequence
                const column = [];

                for (let j = 0; j < matrix.length; j++) {
                    column.push(matrix[j][i]);

                    if (column.length === GRID_SIZE) {
                        break;
                    }
                }

                let firstFoundColumnElement = findSequenceIndexInArray(column);

                if (firstFoundColumnElement !== -1) {
                    found.col = found.col.concat({
                        index: i,
                        startElement: firstFoundColumnElement,
                        endElement: firstFoundColumnElement + FIBONACCI_SEQUENCE.length - 1
                    });
                }
            }

            return found;
        };

        const result = checkRowsAndColsForFibonacci(matrix);

        if (result.col.length || result.row.length) {
            setResults(result);

            // Now that we have results, we need to clear them after 5 seconds.
            // Start building a cleaned matrix
            const newMatrix: number[][] = [];

            for (let i = 0; i < matrix.length; i++) {
                if (isPartOfSequence(i, 0, result)) {
                    newMatrix.push(Array(GRID_SIZE).fill(0));
                }
                newMatrix.push(matrix[i]);

                for (let j = 0; j < matrix[i].length; j++) {
                    if (isPartOfSequence(i, j, result)) {
                        newMatrix[i][j] = 0;
                    }
                }

                // Clear results on a timeout
                timer = setTimeout(() => {
                    setResults(undefined);
                    setMatrix(newMatrix);
                }, 5000);
            }
        }
        return () => {
            clearTimeout(timer);
        };
    }, [matrix]);

    return (
        <div>
            <span>
                Searching for... <pre>[{FIBONACCI_SEQUENCE.join(', ')}]</pre>
            </span>

            {matrix.map((row, x) => (
                <div key={x}>
                    {row.map((cell: number, y: number) => (
                        <Button
                            key={y}
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

function findSequenceIndexInArray(arr: number[]) {
    if (arr.length < FIBONACCI_SEQUENCE.length || FIBONACCI_SEQUENCE.length === 0) return -1;

    for (let i = 0; i <= arr.length - FIBONACCI_SEQUENCE.length; i++) {
        if (arr.slice(i, i + FIBONACCI_SEQUENCE.length).every((val, index) => val === FIBONACCI_SEQUENCE[index])) {
            return i;
        }
    }
    return -1;
}

function isPartOfSequence(x: number, y: number, results: SequenceFoundResultObj | undefined = undefined) {
    if (
        results?.row.some((r) => r.index === x && y >= r.startElement && y <= r.endElement) ||
        results?.col.some((c) => c.index === y && x >= c.startElement && x <= c.endElement)
    ) {
        return true;
    }

    return false;
}
