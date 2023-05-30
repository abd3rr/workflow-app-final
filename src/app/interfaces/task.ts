import { Feedback } from './feedback';
import { Job } from './job';
import { MethodExecution } from './methodExecution';
export interface Task {
  id: number | null;
  taskName: string | null | undefined;
  phaseName?: string;
  phaseId?: number | null;
  stepName?: string;
  description: string | null | undefined;
  instructions: string | null | undefined;
  requiredVerification: boolean | null | undefined;
  stepId: number | null;
  fileIds: number[];
  methodIds: number[];
  assignedJobIds: number[];
  assignedJobs?: Job[];
  parentTaskIds: (number | null)[];
  childTaskIds: (number | null)[];
  status: TaskStatus;
  methodExecutions: (MethodExecution | null)[];
  feedbacks: (Feedback | null)[];
  createdAt?: Date | null;
  startedAt?: Date | null;
  finishedAt?: Date | null;
  isDisabled: boolean;

  [key: string]:
    | string
    | number
    | null
    | undefined
    | boolean
    | number[]
    | Job[]
    | Date
    | (MethodExecution | null)[]
    | (Feedback | null)[]
    | (number | null)[];
}

export type TaskStatus =
  | 'PENDING'
  | 'STARTING'
  | 'FINISHED'
  | 'WAITING_FOR_VALIDATION';
