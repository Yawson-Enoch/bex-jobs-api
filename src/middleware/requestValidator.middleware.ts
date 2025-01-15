import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject, ZodEffects } from 'zod';

interface IValidators {
  body?: AnyZodObject | ZodEffects<AnyZodObject>;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

const requestValidatorMiddleware =
  (validators: IValidators) =>
  async (
    req: Request<unknown, unknown, unknown>,
    _: Response,
    next: NextFunction,
  ) => {
    if (validators.params) {
      req.params = await validators.params.parseAsync(req.params);
    }
    if (validators.body) {
      req.body = await validators.body.parseAsync(req.body);
    }
    if (validators.query) {
      req.query = await validators.query.parseAsync(req.query);
    }
    next();
  };

export default requestValidatorMiddleware;
