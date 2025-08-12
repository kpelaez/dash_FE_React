/// <reference types="vite/client" />

declare global {
  interface Navigator {
    deviceMemory?: number;
    connection?: {
      effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
      downlink?: number;
      rtt?: number;
    };
  }
}

export {};