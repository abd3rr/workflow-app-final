export interface User {
  id: number | null;
  fullName: string;
  email: string;
  role: string;
  passwordHash: string;
  phoneNumber: string;
  address: string;
  profilePicture: string;
  jobId: number;
  [key: string]: string | number | null | undefined;
}
