import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error';

export default class NotFoundError extends CustomError {
  constructor(public message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
