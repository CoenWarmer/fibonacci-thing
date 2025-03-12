import { findSequenceIndicesInArray, findFibonacciSequence } from './findSequenceIndicesInArray';

describe('findSequenceIndicesInArray', () => {
    const values = [
        [
            [0, 1, 1, 2, 3, 5, 8, 13, 21, 34],

            [
                { start: 0, end: 4 },
                { start: 5, end: 9 }
            ]
        ],
        [
            [0, 1, 1, 2, 3, 0, 1, 1, 2, 3],
            [
                { start: 0, end: 4 },
                { start: 5, end: 9 }
            ]
        ],
        [
            [0, 0, 0, 1, 1, 2, 3, 0, 0, 1, 1, 2, 3],
            [
                { start: 2, end: 6 },
                { start: 8, end: 12 }
            ]
        ],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], []]
    ];

    test.each(values)('when passed %j should return %j', (value, result) => {
        expect(findSequenceIndicesInArray(value as number[], 5)).toStrictEqual(result);
    });
});

describe('findFibonacci', () => {
    const correctValues = [
        [[0, 1, 1, 2, 3]],
        [[1, 1, 2, 3, 5]],
        [[1, 2, 3, 5, 8]],
        [[2, 3, 5, 8, 13]],
        [[5, 8, 13, 21, 34]],
        [[21, 34, 55, 89, 144]]
    ];

    test.each(correctValues)('should return true for %j', (value) => {
        expect(findFibonacciSequence(value)).toBe(true);
    });

    const incorrectValues = [
        [[0, 1, 1, 2, 5]],
        [[1, 1, 2, 2, 5]],
        [[1, 13, 3, 5, 8]],
        [[12, 3, 5, 4, 13]]
    ];

    test.each(incorrectValues)('should return false for %j', (value) => {
        expect(findFibonacciSequence(value)).toBe(false);
    });

    const incorrectLengthValues = [
        [[1, 13]],
        [[12, 3, 5, 4]],
        [[0, 2, 0, 1, 1, 3, 3]],
        [[0, 8, 3, 1, 1, 2, 2, 5]],
        [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    ];

    test.each(incorrectLengthValues)('should return false for %j', (value) => {
        expect(findFibonacciSequence(value)).toBe(false);
    });
});
