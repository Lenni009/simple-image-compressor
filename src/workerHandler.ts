import type { WorkerMessage, WorkerResponse } from './types';
// @ts-ignore these are Vite import attributes
import ImageWorker from './worker?worker&inline';

export async function handleWorkerProcess(workerMessage: WorkerMessage) {
  return new Promise<Blob>((resolve, reject) => {
    const worker = new ImageWorker();

    // Send the object URL to the worker
    worker.postMessage(workerMessage);

    worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
      if (data.status === 'error') {
        console.error(data.data);
        reject(new Error(data.data)); // Reject the promise if there's an error
      } else {
        const blob = data.data;
        resolve(blob); // Resolve the promise with the data from the worker
      }
    };
  });
}
