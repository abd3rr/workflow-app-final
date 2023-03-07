export interface Project {
  projectName: string;

  description: string | null;
  [key: string]: string | number | null | undefined;
}
