/*
    Here we try to offload the matrix multiplication to a web worker.
    The problem we have is that the Matrix class is not serializable, 
    which makes it less useful for web workers.
    As a pragmatic solution we create the Floate32Array here, then 
    convert is to an array, which _is_ serializable.

    Further improvements can be made by crafting a data structure which
    is more suitable for processing inside a webworker.
*/

onmessage = (event: MessageEvent<number>) => {
    console.log('Worker received message:', event.data);

    const floatArray = new Float32Array(event.data * event.data);

    // Send the serialized data back to the main thread
    console.log('sending data back to main thread:');
    postMessage({ arrayData: Array.from(floatArray), gridSize: event.data });
};
