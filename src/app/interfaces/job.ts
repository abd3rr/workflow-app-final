import { User } from './user';
export interface Job {
  id: number | null;
  title: string;
  users: User[];
  [key: string]: string | number | null | undefined | User[];
}
