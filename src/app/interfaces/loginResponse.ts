export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId?: number;
  role?: string;
}
