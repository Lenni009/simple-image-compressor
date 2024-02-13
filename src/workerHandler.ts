import { WorkerMessage } from './main';
import ImageWorker from './worker?worker';

export async function handleWorkerProcess(workerMessage: WorkerMessage) {
  return new Promise<Blob>((resolve, reject) => {
    const worker = new ImageWorker();

    // Send the object URL to the worker
    worker.postMessage(workerMessage);

    worker.onmessage = ({ data }: MessageEvent) => {
      worker.terminate();
      if (data instanceof Blob) {
        resolve(data); // Resolve the promise with the data from the worker
      } else {
        reject(new Error('Failed to compress')); // Reject the promise if there's an error
      }
    };

    worker.onerror = (error: Error) => {
      worker.terminate();
      reject(error); // Reject the promise if there's an error
    };
  });
}
