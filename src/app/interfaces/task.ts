import { MethodExecution } from './methodExecution';
export interface Task {
  id: number | null;
  taskName: string | null | undefined;
  description: string | null | undefined;
  instructions: string | null | undefined;
  requiredVerification: boolean | null | undefined;
  stepId: number | null;
  fileIds: number[];
  methodIds: number[];
  assignedJobIds: number[];
  parentTaskIds: (number | null)[];
  childTaskIds: (number | null)[];
  status: TaskStatus;
  methodExecutions: (MethodExecution | null)[];
  [key: string]:
    | string
    | number
    | null
    | undefined
    | boolean
    | number[]
    | (MethodExecution | null)[]
    | (number | null)[];
}

export type TaskStatus =
  | 'PENDING'
  | 'STARTING'
  | 'FINISHED'
  | 'WAITING_FOR_VALIDATION';
