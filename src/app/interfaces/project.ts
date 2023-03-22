import { Phase } from './phase';

export interface Project {
  id: number | null;
  projectName: string;
  description: string | null;
  phases: Phase[];
  [key: string]: string | number | null | undefined | Phase[];
}
