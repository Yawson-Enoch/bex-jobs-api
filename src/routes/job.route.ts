import { Router } from 'express';
import {
  createJob,
  deleteAllJobs,
  deleteJob,
  getAllJobs,
  getJob,
  updateJob,
} from '../controllers/job.controller';
import requestValidatorMiddleware from '../middleware/requestValidator.middleware';
import { jobSchema, jobParamsSchema } from '../schemas/job.schema';

const router = Router();

router
  .route('/')
  .post(
    requestValidatorMiddleware({
      body: jobSchema,
    }),
    createJob
  )
  .get(getAllJobs)
  .delete(deleteAllJobs);

router.use(
  '/:id',
  requestValidatorMiddleware({
    params: jobParamsSchema,
  })
);

router
  .route('/:id')
  .get(getJob)
  .patch(
    requestValidatorMiddleware({
      body: jobSchema,
    }),
    updateJob
  )
  .delete(deleteJob);

export default router;
