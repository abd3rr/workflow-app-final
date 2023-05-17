import { Parameter } from './parameter';
export interface Method {
  id: number | null;
  methodName: string;
  parameters: Parameter[];
  [key: string]: string | number | null | undefined | Parameter[];
}
