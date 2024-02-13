import type { WorkerMessage } from './types';

onmessage = async ({ data }: MessageEvent<WorkerMessage>) => {
  const workerResult = await compressFileWorker(data);
  postMessage(workerResult);
};

async function compressFileWorker({
  img: { width, height },
  file,
  config
}: WorkerMessage) {
  // Create an OffscreenCanvas
  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext('2d');

  // Create an ImageBitmap from the object URL
  const imageBitmap = await createImageBitmap(file);

  // Draw the ImageBitmap onto the OffscreenCanvas
  ctx?.drawImage(imageBitmap, 0, 0);

  const compressedBlob = await offscreenCanvas.convertToBlob({
    type: config.type,
    quality: config.quality,
  });

  return compressedBlob;
}
