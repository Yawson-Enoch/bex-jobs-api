import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error';

export default class ForbiddenError extends CustomError {
  constructor(public message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}
