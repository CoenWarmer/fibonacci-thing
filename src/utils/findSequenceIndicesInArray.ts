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
