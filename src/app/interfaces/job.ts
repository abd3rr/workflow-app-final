import { User } from './user';
export interface Job {
  id: number | null;
  title: string;
  usersId: number[];
  [key: string]: string | number | null | undefined | number[];
}
