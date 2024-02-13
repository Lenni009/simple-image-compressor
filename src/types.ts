import { imageTypes } from './imageTypes';

type ValueOf<T> = T[keyof T];

export interface CompressionConfig {
  type?: ValueOf<typeof imageTypes>;
  quality?: number;
}

export interface WorkerMessage {
  img: { width: number; height: number };
  buffer: ArrayBuffer;
  config: CompressionConfig;
}
