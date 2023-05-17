export interface MethodExecution {
  id: number | null;
  taskId: number;
  methodId: number;
  executed: boolean;
  [key: string]: boolean | number | null | undefined;
}
