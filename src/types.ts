import { imageTypes } from './imageTypes';

type ValueOf<T> = T[keyof T];

type MimeTypes = ValueOf<typeof imageTypes>;

export interface CompressionConfig {
  type?: MimeTypes;
  quality?: number;
}

export interface WorkerMessageConfig extends CompressionConfig {
  originalType: string;
}

export interface WorkerMessage {
  img: { width: number; height: number };
  buffer: ArrayBuffer;
  config: WorkerMessageConfig;
}
