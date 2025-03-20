onmessage = (event: MessageEvent<number>) => {
    console.log('Worker received message:', event.data);

    const floatArray = new Float32Array(event.data * event.data);

    // Send the serialized data back to the main thread
    console.log('sending data back to main thread:');
    postMessage(Array.from(floatArray));
};
