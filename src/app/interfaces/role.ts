export interface Role {
  id: number | null;
  name: string;
  [key: string]: string | number | null | undefined;
}
