export interface Step {
  stepName: string;
  description: string;
  isExpanded: boolean;
  [key: string]: string | number | null | undefined | boolean;
}
