import { CompressionConfig } from './main';

onmessage = async ({ data }) => {
  const { img, file, config } = data;
  const workerResult = await compressFileWorker(img, file, config);
  postMessage(workerResult);
};

async function compressFileWorker(
  { width, height }: { width: number; height: number },
  file: File,
  config: CompressionConfig
) {
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
