export interface MethodExecution {
  id: number | null;
  taskId: number;
  methodId: number;
  status: ExecutionStatus;
  [key: string]: boolean | number | null | undefined | ExecutionStatus;
}

export type ExecutionStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'SUCCESS'
  | 'FAILURE';
