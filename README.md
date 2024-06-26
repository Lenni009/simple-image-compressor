# Simple Image Compressor

This is a client-side file compression library using web workers.

Greatly inspired by https://github.com/WangYuLue/image-conversion

## Installation

### NPM

```sh
npm i simple-image-compressor
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/simple-image-compressor@1.8.2/dist/simple-image-compressor-min.js"></script>
```

## Main function

`compressImage()`

## Parameters

1. file: File
2. config: `{ type: 'image/jpeg' | 'image/webp' = 'image/jpeg', quality: number = 0.92 }`

## Return

`Promise<Blob>`

## Usage

### NPM

```js
import { compressImage } from 'simple-image-compressor';

async function compressFile(file) {
  const options = {
    quality: 0.9,
    type: 'image/jpeg',
  };
  const res = await compressImage(file, options);
  return new File([res], 'new filename.jpg', { type: 'image/jpeg' });
}

const file = document.getElementById('file-input')?.files?.[0];

const compressedImage = await compressFile(file);

// upload to server, etc.
```

### CDN

```html
<html lang="en">
  <head>
    <script src="https://cdn.jsdelivr.net/npm/simple-image-compressor@1.8.1/dist/simple-image-compressor-min.js"></script>
    <script>
      window.onload = () => {
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', async () => {
          const file = fileInput.files[0];
          const options = {
            quality: 0.9,
            type: imageCompressor.imageTypes.WEBP,
          };
          const compressedImage = await imageCompressor.compressImage(file, options);
          // do something with the compressed image
        });
      };
    </script>
  </head>

  <body>
    <input
      id="file-input"
      type="file"
    />
  </body>
</html>
```

### Additional Export

```js
import { imageTypes, compressImage } from 'simple-image-compressor';
```

`imageTypes` is an object containing the two expected values for `config.type`:

```js
const imageTypes = {
  WEBP: 'image/webp',
  JPEG: 'image/jpeg',
};
```

## How it works

File -> imageBitMap -> Canvas -> Blob

"ImageBitMap -> Canvas -> Blob" happens in a web worker, allowing for parallel processing.

## Similar Packages

- [browser-image-compression](https://www.npmjs.com/package/browser-image-compression)
- [image-conversion](https://www.npmjs.com/package/image-conversion)
