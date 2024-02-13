import { imageTypes } from './imageTypes';
import { objectURLtoImage } from './objectURLtoImage';
import type { CompressionConfig, WorkerMessage } from './types';
import { handleWorkerProcess } from './workerHandler';

export async function compressImage(file: File, config: CompressionConfig = {}): Promise<Blob> {
  // assign default values if no values are given
  config.type ??= imageTypes.JPEG;
  config.quality ??= 0.92;

  // get width & height of file for canvas dimensions in worker
  const objectUrl = URL.createObjectURL(file);
  const { width, height } = await objectURLtoImage(objectUrl);
  URL.revokeObjectURL(objectUrl);

const buffer = await file.arrayBuffer();

  // construct object to send to worker
  const workerMessage: WorkerMessage = { img: { width, height }, buffer, config };

  // let the worker process the file
  const compressedBlob = await handleWorkerProcess(workerMessage);

  // if the compression made size worse, just return the original file
  return compressedBlob;
}

export { imageTypes, CompressionConfig };
