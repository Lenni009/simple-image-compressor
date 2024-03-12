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
  file: File;
  config: WorkerMessageConfig;
}

type Status = 'success' | 'error';
type WorkerData = File | string;

interface GenericWorkerResponse<T extends Status, U extends WorkerData> {
  status: T;
  data: U;
}

export type WorkerSuccessResponse = GenericWorkerResponse<'success', File>;
export type WorkerErrorResponse = GenericWorkerResponse<'error', string>;

export type WorkerResponse = WorkerSuccessResponse | WorkerErrorResponse;
