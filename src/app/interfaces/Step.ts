export interface Step {
  stepName: string;
  description: string | null;
  isExpanded: boolean;
  [key: string]: string | number | null | boolean | undefined;
}
