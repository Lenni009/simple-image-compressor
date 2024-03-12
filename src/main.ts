import { imageTypes } from './imageTypes';
import type { CompressionConfig, WorkerMessage, WorkerMessageConfig } from './types';
import { handleWorkerProcess } from './workerHandler';

export async function compressImage(file: File, config: CompressionConfig = {}): Promise<Blob> {
  // assign default values if no values are given
  config.type ??= imageTypes.JPEG;
  config.quality ??= 0.92;

  const workerConfig: WorkerMessageConfig = {
    originalType: file.type,
    ...config,
  };

  // construct object to send to worker
  const workerMessage: WorkerMessage = { file, config: workerConfig };

  // let the worker process the file
  const compressedBlob = await handleWorkerProcess(workerMessage);

  // if the compression made size worse, just return the original file
  return compressedBlob;
}

// export for final bundle
export { imageTypes, type CompressionConfig };
