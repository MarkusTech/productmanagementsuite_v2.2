export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintains proper stack trace for where the error was thrown (only for V8 engines)
    Error.captureStackTrace(this, this.constructor);
  }
}
