import { Matrix } from '../components/game/Matrix';
import {
    checkRowsAndColsForFibonacciSequences,
    findSequenceIndicesInArray,
    findFibonacciSequence,
    isPartOfSequence,
    getTotalSequences,
    isCoordinateInSequence
} from './sequences';

function turnArrayMatrixIntoMatrixClass(matrix: number[][]): Matrix {
    const rows = matrix.length;
    const cols = matrix[0].length;

    const matrixClass = new Matrix(rows, cols);

    // Populate the matrix
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            matrixClass.set(i, j, matrix[i][j]);
        }
    }

    return matrixClass;
}

describe('Sequence utils', () => {
    describe('checkRowsAndColsForFibonacciSequences', () => {
        it('should return an object with all the found fibonacci sequences', () => {
            const matrix = turnArrayMatrixIntoMatrixClass([
                [0, 1, 1, 2, 3],
                [1, 1, 2, 3, 5],
                [1, 2, 3, 5, 8],
                [2, 3, 5, 8, 13],
                [5, 8, 13, 21, 34]
            ]);

            const result = checkRowsAndColsForFibonacciSequences(matrix, 5);

            expect(result).toStrictEqual({
                row: [
                    { index: 0, sequences: [{ start: 0, end: 4 }] },
                    { index: 1, sequences: [{ start: 0, end: 4 }] },
                    { index: 2, sequences: [{ start: 0, end: 4 }] },
                    { index: 3, sequences: [{ start: 0, end: 4 }] },
                    { index: 4, sequences: [{ start: 0, end: 4 }] }
                ],
                col: []
            });
        });

        it('should return an object with all the found fibonacci sequences in the rows', () => {
            const matrix = turnArrayMatrixIntoMatrixClass([
                [0, 0, 4, 1, 1, 2, 3, 13],
                [0, 3, 5, 1, 1, 2, 3, 5],
                [5, 3, 1, 1, 2, 3, 5, 8],
                [6, 3, 6, 2, 3, 5, 8, 13],
                [1, 6, 5, 8, 13, 21, 34, 0],
                [1, 6, 5, 8, 13, 21, 34, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [6, 3, 6, 2, 3, 5, 8, 13]
            ]);

            const result = checkRowsAndColsForFibonacciSequences(matrix, 5);

            expect(result).toStrictEqual({
                row: [
                    {
                        index: 1,
                        sequences: [{ start: 3, end: 7 }]
                    },
                    {
                        index: 2,
                        sequences: [{ start: 2, end: 6 }]
                    },
                    {
                        index: 3,
                        sequences: [{ start: 3, end: 7 }]
                    },
                    {
                        index: 4,
                        sequences: [{ start: 2, end: 6 }]
                    },
                    {
                        index: 5,
                        sequences: [{ start: 2, end: 6 }]
                    },
                    {
                        index: 7,
                        sequences: [{ start: 3, end: 7 }]
                    }
                ],
                col: []
            });
        });

        it('should return an object with all the found fibonacci sequences in the rows also when there are multiple sequences', () => {
            const matrix = turnArrayMatrixIntoMatrixClass([
                [0, 1, 1, 2, 3, 5, 3, 3, 5, 8, 13, 21],
                [0, 1, 1, 3, 3, 5, 3, 5, 8, 13, 21, 5],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]);

            const result = checkRowsAndColsForFibonacciSequences(matrix, 5);

            expect(result).toStrictEqual({
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 7, end: 11 }
                        ]
                    },
                    {
                        index: 1,
                        sequences: [{ start: 6, end: 10 }]
                    }
                ],
                col: []
            });
        });

        it('should return an object with all the found fibonacci sequences in the rows and columns', () => {
            const matrix = turnArrayMatrixIntoMatrixClass([
                [0, 1, 1, 2, 3, 5, 3, 3, 5, 8, 13, 21],
                [1, 1, 1, 3, 3, 8, 3, 5, 8, 13, 21, 5],
                [1, 1, 1, 3, 3, 13, 3, 5, 8, 13, 21, 5],
                [2, 1, 1, 3, 3, 21, 3, 5, 13, 13, 21, 5],
                [3, 1, 1, 3, 3, 34, 3, 5, 21, 13, 21, 5],
                [5, 1, 1, 3, 3, 5, 3, 5, 34, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5],
                [0, 1, 1, 3, 3, 5, 3, 5, 55, 13, 21, 5]
            ]);

            const result = checkRowsAndColsForFibonacciSequences(matrix, 5);

            expect(result).toStrictEqual({
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 7, end: 11 }
                        ]
                    },
                    {
                        index: 1,
                        sequences: [{ start: 6, end: 10 }]
                    },
                    {
                        index: 2,
                        sequences: [{ start: 6, end: 10 }]
                    }
                ],
                col: [
                    {
                        index: 0,
                        sequences: [
                            {
                                start: 0,
                                end: 4
                            }
                        ]
                    },
                    {
                        index: 5,
                        sequences: [
                            {
                                start: 0,
                                end: 4
                            }
                        ]
                    },
                    {
                        index: 8,
                        sequences: [{ start: 2, end: 6 }]
                    }
                ]
            });
        });
    });

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

    describe('findFibonacciSequence', () => {
        const correctValues = [
            [[0, 1, 1, 2, 3]],
            [[1, 1, 2, 3, 5]],
            [[1, 2, 3, 5, 8]],
            [[2, 3, 5, 8, 13]],
            [[5, 8, 13, 21, 34]],
            [[8, 13, 21, 34, 55]],
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

        const fibonacciLikeValues = [
            [[10, 10, 20, 30, 50]],
            [[3, 4, 7, 11, 18, 29]],
            [[0, 2, 2, 4, 6, 10, 16]]
        ];

        test.each(fibonacciLikeValues)('should return false for %j', (value) => {
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

    describe('isPartOfSequence', () => {
        it('should return false if no results are passed', () => {
            expect(isPartOfSequence(0, 0)).toBe(false);
        });

        it('should return true if the coordinate is part of a sequence', () => {
            const results = {
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 5, end: 9 }
                        ]
                    }
                ],
                col: []
            };

            expect(isPartOfSequence(0, 0, results)).toBe(true);
            expect(isPartOfSequence(5, 0, results)).toBe(true);
        });

        it('should return false if the coordinate is not part of a sequence', () => {
            const results = {
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 7, end: 12 }
                        ]
                    }
                ],
                col: []
            };

            expect(isPartOfSequence(0, 10, results)).toBe(false);
            expect(isPartOfSequence(0, 6, results)).toBe(false);
        });
    });

    describe('isCoordinateInSequence', () => {
        it('should return false if no results are passed', () => {
            expect(isCoordinateInSequence([], 0, 0)).toBe(false);
        });

        it('should return true if the coordinate is part of a sequence', () => {
            const results = [
                {
                    index: 0,
                    sequences: [
                        { start: 0, end: 4 },
                        { start: 5, end: 9 }
                    ]
                }
            ];

            expect(isCoordinateInSequence(results, 0, 0)).toBe(true);
            expect(isCoordinateInSequence(results, 5, 0)).toBe(true);
        });

        it('should return false if the coordinate is not part of a sequence', () => {
            const results = [
                {
                    index: 0,
                    sequences: [
                        { start: 0, end: 4 },
                        { start: 7, end: 12 }
                    ]
                }
            ];

            expect(isCoordinateInSequence(results, 0, 10)).toBe(false);
            expect(isCoordinateInSequence(results, 0, 6)).toBe(false);
        });
    });

    describe('getTotalSequences', () => {
        it('should return 0 if no results are passed', () => {
            expect(getTotalSequences(undefined)).toBe(0);
        });

        it('should return the total number of sequences', () => {
            const results = {
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 5, end: 9 }
                        ]
                    }
                ],
                col: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 5, end: 9 }
                        ]
                    }
                ]
            };

            expect(getTotalSequences(results)).toBe(4);
        });

        it('should return the total number of sequences', () => {
            const results = {
                row: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 5, end: 9 }
                        ]
                    }
                ],
                col: []
            };

            expect(getTotalSequences(results)).toBe(2);
        });

        it('should return the total number of sequences', () => {
            const results = {
                row: [],
                col: [
                    {
                        index: 0,
                        sequences: [
                            { start: 0, end: 4 },
                            { start: 5, end: 9 }
                        ]
                    }
                ]
            };

            expect(getTotalSequences(results)).toBe(2);
        });

        it('should return the total number of sequences', () => {
            const results = {
                row: [],
                col: []
            };

            expect(getTotalSequences(results)).toBe(0);
        });
    });
});
