import { describe, it, expect } from 'vitest';
import { compressImage, imageTypes } from '@/main';

// due to browser incompatibilities and the @vitest/worker package being too slow, we have to use random images from an API.
// the browser cannot handle node's fs package to get local image data
// @vitest/worker takes over 60s (I never checked whether it actually succeeds eventually) for a single test
const imageData = await fetch('https://picsum.photos/1920/1080');
const fileBlob = await imageData.blob();
const file = new File([fileBlob], 'file.jpeg', { type: 'image/jpeg' });

describe('imageCompressor', () => {
  it('should resolve the promise with a blob', async () => {
    await expect(compressImage(file)).resolves.toBeInstanceOf(Blob);
  });

  // they can also become larger, we do not care about this. We just apply the given compression level.
  it('should always change the image filesize in jpg', async () => {
    const compressedFile = await compressImage(file, { type: imageTypes.JPEG, quality: 100 });
    expect(compressedFile.size).not.toBe(file.size);
  });

  it('should always change the image filesize in webp', async () => {
    const compressedFile = await compressImage(file, { type: imageTypes.WEBP, quality: 100 });
    expect(compressedFile.size).not.toBe(file.size);
  });

  it('should convert to jpeg', async () => {
    const compressedFile = await compressImage(file, { type: imageTypes.JPEG });
    expect(compressedFile.type).toBe(imageTypes.JPEG);
  });

  it('should convert to webp', async () => {
    const compressedFile = await compressImage(file, { type: imageTypes.WEBP });
    expect(compressedFile.type).toBe(imageTypes.WEBP);
  });

  it('should compress with different jpeg quality', async () => {
    const hqFile = await compressImage(file, { quality: 100, type: imageTypes.JPEG });
    const lqFile = await compressImage(file, { quality: 0, type: imageTypes.JPEG });
    expect(lqFile.size).toBeLessThan(hqFile.size);
  });

  it('should compress with different webp quality', async () => {
    const hqFile = await compressImage(file, { quality: 100, type: imageTypes.WEBP });
    const lqFile = await compressImage(file, { quality: 0, type: imageTypes.WEBP });
    expect(lqFile.size).toBeLessThan(hqFile.size);
  });

  // Doesn't work for some reason
  it('should recognise bad files', async () => {
    const buffer = new ArrayBuffer(1000000); // 1MB file
    const badFile = new File([buffer], 'badFile.jpg', { type: 'image/jpeg' });
    await expect(compressImage(badFile)).rejects.toThrowError();
  });
});
