import type { WorkerErrorResponse, WorkerMessage, WorkerSuccessResponse } from './types';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  try {
    const workerResult = await compressFileWorker(data);
    const transferObject: WorkerSuccessResponse = {
      status: 'success',
      data: workerResult,
    };
    postMessage(transferObject);
  } catch (error) {
    const errorMessage = `Could not compress! ${error instanceof Error ? error.message : ''}`;
    const transferObject: WorkerErrorResponse = {
      status: 'error',
      data: errorMessage,
    };
    postMessage(transferObject);
  } finally {
    close();
  }
};

async function compressFileWorker({ img: { width, height }, file, config }: WorkerMessage) {
  // Create an OffscreenCanvas
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext('bitmaprenderer');

  // Create an ImageBitmap from the file
  const imageBitmap = await createImageBitmap(file);

  // Transfer the ImageBitmap to the OffscreenCanvas
  ctx?.transferFromImageBitmap(imageBitmap);

  const compressedBlob = await offscreenCanvas.convertToBlob(config);

  return compressedBlob;
}
