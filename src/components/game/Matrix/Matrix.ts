import { SequenceFoundResultObj } from 'src/utils/sequences';

export class Matrix {
    private rowOffsets: number[];

    rows: number;
    cols: number;
    data: Float32Array;

    constructor(rows: number, cols: number, opts: { prefillArray: boolean }) {
        this.rows = rows;
        this.cols = cols;
        this.data = opts.prefillArray ? new Float32Array(rows * cols) : new Float32Array();
        this.rowOffsets = Array.from({ length: rows }, (_, i) => i * cols); // Precompute row offsets
    }

    // Get value at (row, col)
    get(row: number, col: number) {
        // return this.data[row * this.cols + col];
        return this.data[this.rowOffsets[row] + col];
    }

    // Set value at (row, col)
    set(row: number, col: number, value: number): void {
        this.data[this.rowOffsets[row] + col] = value;
    }

    getRow(row: number): number[] {
        const start = this.rowOffsets[row];
        return Array.from(this.data.slice(start, start + this.cols));
    }

    getColumn(col: number): number[] {
        return Array.from({ length: this.rows }, (_, i) => this.data[this.rowOffsets[i] + col]);
    }

    increment(row: number, col: number): void {
        this.incrementRow(row);
        this.incrementColumn(col);

        const currentValue = this.get(row, col);
        this.set(row, col, currentValue > 1 ? currentValue - 1 : 0);
    }

    incrementRow(row: number): void {
        const start = this.rowOffsets[row]; // Use precomputed row offset
        for (let j = 0; j < this.cols; j++) {
            this.data[start + j] += 1;
        }
    }

    incrementColumn(col: number): void {
        for (let i = 0; i < this.rows; i++) {
            this.data[this.rowOffsets[i] + col] += 1; // Use precomputed row offset
        }
    }

    clearSequencesFromResultObject(result: SequenceFoundResultObj): void {
        for (const row of result.row) {
            for (const sequence of row.sequences) {
                this.clearSequenceFromRow(row.index, sequence.start, sequence.end);
            }
        }

        for (const col of result.col) {
            for (const sequence of col.sequences) {
                this.clearSequenceFromColumn(col.index, sequence.start, sequence.end);
            }
        }
    }

    clearSequenceFromRow(row: number, start: number, end: number): void {
        for (let i = start; i <= end; i++) {
            this.set(row, i, 0);
        }
    }

    clearSequenceFromColumn(col: number, start: number, end: number): void {
        for (let i = start; i <= end; i++) {
            this.set(i, col, 0);
        }
    }
}

export function estimateMatrixMemoryUsage(rows: number, cols: number): number {
    const float32ArraySize = rows * cols * 4; // Each Float32 element is 4 bytes
    const otherPropertiesSize = 8 + 8; // `rows` and `cols` (2 numbers, 8 bytes each)
    return float32ArraySize + otherPropertiesSize;
}
