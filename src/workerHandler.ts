import type { WorkerMessage } from './types';
import ImageWorker from './worker?worker';

export async function handleWorkerProcess(workerMessage: WorkerMessage) {
  return new Promise<Blob>((resolve, reject) => {
    const worker = new ImageWorker();

    // Send the object URL to the worker
    worker.postMessage(workerMessage, [workerMessage.buffer]);

    worker.onmessage = ({ data }: MessageEvent<{ buffer: ArrayBuffer }>) => {
      const file = new Blob([data.buffer], { type: workerMessage.config.type });
      resolve(file); // Resolve the promise with the data from the worker
    };

    worker.onerror = (error: Error) => {
      reject(error); // Reject the promise if there's an error
    };
  });
}
