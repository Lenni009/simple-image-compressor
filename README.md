# Simple Image Compressor

This is a client-side file compression library using web workers.

Greatly inspired by https://github.com/WangYuLue/image-conversion

Main function: `compressImage()`

## Parameters

1. file: File
2. config: `{ type: 'image/png' | 'image/jpeg' | 'image/gif' = 'image/jpeg', quality: number = 0.92 }`

## Return

Promise<Blob>

## Usage

```ts
import { compressImage } from 'simple-image-compressor';

async function compressFile(file) {
  const res = await compressImage(file, {
    quality: 0.9,
    type: 'image/jpeg',
  });
  return new File([res], 'new filename.jpg', { type: 'image/jpeg' });
}

const file = document.getElementById('file-input')?.files?.[0];

const compressedImage = await compressFile(file);

// upload to server, etc.
```

### Additional Export

```ts
import { imageTypes, compressImage } from 'simple-image-compressor';
```

`imageTypes` is an object containing the three expected values for `config.type`:

```ts
const imageTypes = {
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
}
```

## How it works

File -> ObjectURL & HTMLImageElement (width + height) -> imageBitMap -> Canvas -> Blob

"ImageBitMap -> Canvas -> Blob" happens in a web worker, allowing for parallel processing.
