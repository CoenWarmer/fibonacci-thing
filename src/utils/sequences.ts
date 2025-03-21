import { Matrix } from '../components/game/Matrix/Matrix';

export type SequenceFoundResultObj = {
    row: SequenceFoundResult[];
    col: SequenceFoundResult[];
};

export type SequenceFoundResult = {
    index: number;
    sequences: {
        start: number;
        end: number;
    }[];
};

export function findSequenceIndicesInArray(
    arr: number[],
    sequenceLength: number
): { start: number; end: number }[] {
    const indices = [];

    for (let i = 0; i < arr.length; i++) {
        // Slice the array based on the for loop index
        const slice = arr.slice(i, i + sequenceLength);

        // Once we move through the array, the slice might be less than the sequence length, so we need to check for that
        if (slice.length === sequenceLength) {
            const sequenceIsPresent = findFibonacciSequence(slice);

            if (sequenceIsPresent) {
                indices.push({ start: i, end: i + sequenceLength - 1 });
                i = i + sequenceLength - 1; // Move the index to the end of the sequence length so we can slice the next portion of the array
            }
        }
    }

    return indices;
}

export function findFibonacciSequence(arr: number[]): boolean {
    if (arr.length < 3) return false; // A Fibonacci sequence must have at least 3 numbers

    const maxNum = Math.max(...arr);
    const fibonacciArray = generateFibonacci(maxNum);

    // Check for contiguous Fibonacci sequence
    for (let i = 0; i < arr.length - 2; i++) {
        if (fibonacciArray.includes(arr[i]) && fibonacciArray.includes(arr[i + 1])) {
            let a = arr[i],
                b = arr[i + 1];
            let j = i + 2;

            while (
                j < arr.length &&
                fibonacciArray.includes(arr[j]) &&
                arr[j] === a + b &&
                arr[i + 1] !== 0 &&
                arr[i + 2] !== 0
            ) {
                a = b;
                b = arr[j];
                j++;
            }

            if (j - i === arr.length) {
                return true; // Found a valid Fibonacci sequence
            }
        }
    }

    return false;
}

function generateFibonacci(limit: number): number[] {
    const fibArray: number[] = [];
    let a = 0,
        b = 1;

    fibArray.push(a);
    fibArray.push(b);

    for (let next = a + b; next <= limit; next = a + b) {
        fibArray.push(next);
        a = b;
        b = next;
    }

    return fibArray;
}

export function isPartOfSequence(
    x: number,
    y: number,
    results: SequenceFoundResultObj | undefined = undefined
) {
    if (!results) {
        return false;
    }

    return isCoordinateInSequence(results.row, x, y) || isCoordinateInSequence(results.col, y, x);
}

export function isCoordinateInSequence(
    foundSequences: SequenceFoundResult[],
    x: number,
    y: number
) {
    for (const result of foundSequences) {
        if (result.index === y) {
            for (const sequence of result.sequences) {
                if (x >= sequence.start && x <= sequence.end) {
                    return true;
                }
            }
        }
    }

    return false;
}

export function getTotalSequences(results: SequenceFoundResultObj | undefined) {
    if (!results) {
        return 0;
    }

    const rowSequences = results?.row.reduce((acc, row) => {
        return acc + row.sequences.length;
    }, 0);

    const colSequences = results?.col.reduce((acc, col) => {
        return acc + col.sequences.length;
    }, 0);

    return rowSequences + colSequences;
}

export function checkRowsAndColsForFibonacciSequences(matrix: Matrix, sequenceLength: number) {
    const found: SequenceFoundResultObj = {
        row: [],
        col: []
    };

    for (let i = 0; i < matrix.rows; i++) {
        // Check rows for the sequence
        const rowSequenceIndices = findSequenceIndicesInArray(matrix.getRow(i), sequenceLength);

        if (rowSequenceIndices.length) {
            found.row = found.row.concat({
                index: i,
                sequences: rowSequenceIndices
            });
        }

        const columnSequenceIndices = findSequenceIndicesInArray(
            matrix.getColumn(i),
            sequenceLength
        );

        if (columnSequenceIndices.length) {
            found.col = found.col.concat({
                index: i,
                sequences: columnSequenceIndices
            });
        }
    }

    return found;
}
