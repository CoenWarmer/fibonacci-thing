/*
    Here we try to offload the matrix multiplication to a web worker.
    The problem we have is that the Matrix class is not serializable, 
    which makes it less useful to transfer via a web worker.
*/

import { checkRowsAndColsForFibonacciSequences, SequenceFoundResultObj } from 'src/utils/sequences';
import { Matrix } from './Matrix';

export interface MatrixWorker extends Worker {
    postMessage: (message: MatrixWorkerMessage) => void;
    onmessage: (event: MessageEvent<MatrixWorkerResponse>) => void;
}

export type MatrixWorkerMessage =
    | {
          type: 'generateMatrix';
          options: { gridSize: number };
      }
    | {
          type: 'checkMatrix';
          options: { gridSize: number; sequenceLength: number; data: ArrayBufferLike };
      };

export type MatrixWorkerResponse =
    | {
          type: 'generateMatrix';
          response: {
              arrayData: ArrayBuffer;
              gridSize: number;
          };
      }
    | {
          type: 'checkMatrix';
          response: {
              result: SequenceFoundResultObj;
          };
      }
    | {
          type: 'checkMatrixProgress';
          response: {
              loading: boolean;
          };
      };

onmessage = (event: MessageEvent<MatrixWorkerMessage>) => {
    console.log('Worker received message:', event.data);

    const { type } = event.data;

    if (type === 'generateMatrix') {
        const { gridSize } = event.data.options;

        const floatArray = new Float32Array(gridSize * gridSize);

        const response: MatrixWorkerResponse = {
            type: 'generateMatrix',
            response: {
                arrayData: floatArray.buffer,
                gridSize
            }
        };

        postMessage(response);
    }

    if (type === 'checkMatrix') {
        const { data, sequenceLength, gridSize } = event.data.options;

        postMessage({ type: 'checkMatrixProgress', response: { loading: true } });

        const matrix = new Matrix(gridSize, gridSize, { prefillArray: false });
        matrix.data = new Float32Array(data);

        const result = checkRowsAndColsForFibonacciSequences(matrix, sequenceLength);

        const response: MatrixWorkerResponse = {
            type: 'checkMatrix',
            response: {
                result
            }
        };

        postMessage(response);
    }
};
