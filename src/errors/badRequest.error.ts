import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error';

export default class BadRequestError extends CustomError {
  constructor(public message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
