export interface Parameter {
  id: number | null;
  parameterName: string;
  parameterType: string;
  [key: string]: string | number | null | undefined;
}
