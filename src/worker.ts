import type { WorkerMessage } from './types';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  try {
    const workerResult = await compressFileWorker(data);
    const buffer = await workerResult.arrayBuffer();
    const transferObject = { buffer };
    postMessage(transferObject, { transfer: [transferObject.buffer] });
  } catch (error) {
    const errorMsg = `Could not compress! ${error instanceof Error ? error.message : ''}`;
    throw new Error(errorMsg);
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
