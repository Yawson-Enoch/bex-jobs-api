import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const schemaValidatorMiddleware =
  (schema: AnyZodObject) =>
  (
    req: Request<unknown, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  };

export default schemaValidatorMiddleware;
