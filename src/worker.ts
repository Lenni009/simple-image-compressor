import type { WorkerErrorResponse, WorkerMessage, WorkerSuccessResponse } from './types';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  try {
    const workerResult = await compressFileWorker(data);
    const buffer = await workerResult.arrayBuffer();
    const transferObject: WorkerSuccessResponse = {
      status: 'success',
      data: buffer,
    };
    postMessage(transferObject, { transfer: [transferObject.data] });
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

async function compressFileWorker({ img: { width, height }, buffer, config }: WorkerMessage) {
  // Create an OffscreenCanvas
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext('2d');

  const blob = new Blob([buffer], { type: config.originalType });

  // Create an ImageBitmap from the blob
  const imageBitmap = await createImageBitmap(blob);

  // Draw the ImageBitmap onto the OffscreenCanvas
  ctx?.drawImage(imageBitmap, 0, 0);

  const compressedBlob = await offscreenCanvas.convertToBlob(config);

  return compressedBlob;
}
