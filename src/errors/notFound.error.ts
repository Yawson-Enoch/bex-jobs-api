import { StatusCodes } from 'http-status-codes';
import CustomAPIError from './customAPI.error';

export default class NotFoundError extends CustomAPIError {
  constructor(public message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}
