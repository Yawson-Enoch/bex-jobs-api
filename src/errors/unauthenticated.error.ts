import { StatusCodes } from 'http-status-codes';
import CustomError from './custom.error';

export default class UnauthenticatedError extends CustomError {
  constructor(public message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
