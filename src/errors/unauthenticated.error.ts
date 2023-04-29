import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customAPI.error';

export default class UnauthenticatedError extends CustomAPIError {
  constructor(public message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = 'UnauthenticatedError';
  }
}
