export interface File {
  id: number | null;
  fileName: string;
  filePath: string;
  size: number;
  contentType: string;
  uploadDateTime: string;
  taskIds: number[];
  [key: string]: string | number | null | undefined | number[];
}
