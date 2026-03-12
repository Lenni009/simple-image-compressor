import type { WorkerMessage, WorkerResponse } from './types';
// @ts-expect-error these are Vite import attributes
import ImageWorker from './worker?worker&inline';

export function handleWorkerProcess(workerMessage: WorkerMessage) {
  return new Promise<Blob>((resolve, reject) => {
    const worker = new ImageWorker();

    // Send file and metadata to the worker
    worker.postMessage(workerMessage, worker.location?.origin);

    worker.addEventListener('message', ({ data }: MessageEvent<WorkerResponse>) => {
      if (data.status === 'error') {
        console.error(data.data);
        reject(new Error(data.data)); // Reject the promise if there's an error
      } else {
        const blob = data.data;
        resolve(blob); // Resolve the promise with the data from the worker
      }
    });
  });
}
