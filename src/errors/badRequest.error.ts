import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customAPI.error';

export default class BadRequestError extends CustomAPIError {
  constructor(public message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = 'BadRequestError';
  }
}
