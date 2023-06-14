export interface User {
  id: number | null;
  fullName: string;
  email: string;
  roleName: string;
  passwordHash: string;
  phoneNumber: string;
  address: string;
  profilePictureId: number;
  jobId: number;
  [key: string]: string | number | null | undefined;
}
