export default class CustomError extends Error {
  isOperational: boolean;

  constructor(public message: string, public statusCode: number) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
