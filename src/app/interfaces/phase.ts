import { Step } from './step';

export interface Phase {
  id: number | null;
  phaseName: string;
  description: string | null;
  isExpanded: boolean;
  steps: Step[];
  [key: string]: string | number | null | boolean | undefined | Step[];
}
