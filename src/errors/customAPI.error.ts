export default class CustomAPIError extends Error {
  isOperational: boolean;

  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.isOperational = true;
    this.statusCode = statusCode;
    this.name = 'CustomAPIError';
    Error.captureStackTrace(this, this.constructor);
  }
}
