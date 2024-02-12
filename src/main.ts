import { objectURLtoImage } from './objectURLtoImage';
import { handleWorkerProcess } from './workerHandler';

export const imageTypes = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
} as const;

type ValueOf<T> = T[keyof T];

export interface CompressionConfig {
  type?: ValueOf<typeof imageTypes>;
  quality?: number;
}

export interface WorkerMessage {
  img: { width: number; height: number };
  file: File;
  config: CompressionConfig;
}

export async function compressImage(file: File, config: CompressionConfig = {}): Promise<Blob> {
  // assign default values if no values are given
  config.type ??= imageTypes.JPEG;
  config.quality ??= 0.92;

  // get width & height of file for canvas dimensions in worker
  const objectUrl = URL.createObjectURL(file);
  const { width, height } = await objectURLtoImage(objectUrl);

  // construct object to send to worker
  const workerMessage: WorkerMessage = { img: { width, height }, file, config };

  // let the worker process the file
  const compressedBlob = await handleWorkerProcess(workerMessage);

  // if the compression made size worse, just return the original file
  return compressedBlob.size > file.size ? file : compressedBlob;
}
