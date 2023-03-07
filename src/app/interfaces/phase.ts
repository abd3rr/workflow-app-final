import { Step } from './Step';
export interface Phase {
  phaseName: string;
  description: string | null;
  isExpanded: boolean;
  steps: Step[];
  [key: string]: string | number | null | boolean | undefined | Step[];
}
