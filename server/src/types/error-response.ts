export type ErrorResponse = {
  error: true;
  message: string;
  timestamp?: string;
  code: number;
  path: string;
};
