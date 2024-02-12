import { WorkerMessage } from '.';

export async function handleWorkerProcess(workerMessage: WorkerMessage) {
  return new Promise<Blob>((resolve, reject) => {
    const path = new URL('./worker.ts', import.meta.url);
    const worker = new Worker(path);

    // Send the object URL to the worker
    worker.postMessage(workerMessage);

    worker.onmessage = ({ data }) => {
      worker.terminate();
      if (data instanceof Blob) {
        resolve(data); // Resolve the promise with the data from the worker
      } else {
        reject(new Error('Failed to compress')); // Reject the promise if there's an error
      }
    };

    worker.onerror = (error) => {
      worker.terminate();
      reject(error); // Reject the promise if there's an error
    };
  });
}
