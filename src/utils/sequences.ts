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
        if (slice.length === 5) {
            const sequenceIsPresent = findFibonacciSequence(slice);

            if (sequenceIsPresent) {
                indices.push({ start: i, end: i + sequenceLength - 1 });
                i = i + sequenceLength - 1; // Move the index to the end of the sequence length so we can slice the next portion of the array
            }
        }
    }

    return indices;
}

export function findFibonacciSequence(arr: number[]) {
    const sequence = [];

    for (let i = 0; i < arr.length - 2; i++) {
        // Do a lookup in the array to figure out if the sequence is a fibonacci sequence
        // Also handle a case where the sequence is 0, 0, 0
        if (arr[i] + arr[i + 1] === arr[i + 2] && arr[i + 1] !== 0 && arr[i + 2] !== 0) {
            sequence.push(arr[i]);

            if (sequence.length === 3) {
                sequence.push(arr[i + 1]);
                sequence.push(arr[i + 2]);
                return true;
            }
        } else {
            sequence.length = 0;
        }
    }

    return false;
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

export function checkRowsAndColsForFibonacciSequences(matrix: number[][], sequenceLength: number) {
    const found: SequenceFoundResultObj = {
        row: [],
        col: []
    };

    const rows = matrix.length;

    // check if the column length is the same size as the row length

    for (let i = 0; i < rows; i++) {
        // Check rows for the sequence
        const rowSequenceIndices = findSequenceIndicesInArray(matrix[i], sequenceLength);

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

        const columnSequenceIndices = findSequenceIndicesInArray(column, sequenceLength);

        if (columnSequenceIndices.length) {
            found.col = found.col.concat({
                index: i,
                sequences: columnSequenceIndices
            });
        }
    }

    return found;
}
