export interface Step {
  id: number | null;
  stepName: string;
  description: string;
  isExpanded: boolean;
  [key: string]: string | number | null | undefined | boolean;
}
