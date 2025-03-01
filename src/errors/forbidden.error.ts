import { StatusCodes } from 'http-status-codes';

import CustomAPIError from './customAPI.error';

export default class ForbiddenError extends CustomAPIError {
  constructor(public message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}
