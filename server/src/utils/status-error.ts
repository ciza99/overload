export type StatusErrorProps = {
  code?: number;
  message?: string;
  options?: ErrorOptions;
};

export class StatusError extends Error {
  code: number;
  timestamp: string;

  constructor(props?: StatusErrorProps) {
    const { code = 500, message, options } = props ?? {};

    super(message, options);
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}
