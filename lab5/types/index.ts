export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  modificationTime?: number;
}

export interface MemoryStats {
  totalSpace: number;
  freeSpace: number;
  usedSpace: number;
}