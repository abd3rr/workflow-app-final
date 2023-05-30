export interface Feedback {
  id: number | null;
  message: string;
  feedbackDateTime: Date | undefined;
  userId: number;
  [key: string]: string | number | null | undefined | Date;
}
