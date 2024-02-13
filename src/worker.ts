import type { WorkerMessage } from './types';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  const workerResult = await compressFileWorker(data);
  const buffer = await workerResult.arrayBuffer();
  const transferObject = { buffer };
  postMessage(transferObject, { transfer: [transferObject.buffer] });
};

async function compressFileWorker({ img: { width, height }, buffer, config }: WorkerMessage) {
  // Create an OffscreenCanvas
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext('2d');

  const blob = new Blob([buffer]);

  // Create an ImageBitmap from the object URL
  const imageBitmap = await createImageBitmap(blob);

  // Draw the ImageBitmap onto the OffscreenCanvas
  ctx?.drawImage(imageBitmap, 0, 0);

  const compressedBlob = await offscreenCanvas.convertToBlob(config);

  return compressedBlob;
}
