import { Router } from 'express';
import {
  createJob,
  deleteJobs,
  deleteJob,
  getJobs,
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
  .get(getJobs)
  .delete(deleteJobs);

router.use(
  '/:jobID',
  requestValidatorMiddleware({
    params: jobParamsSchema,
  })
);

router
  .route('/:jobID')
  .get(getJob)
  .patch(
    requestValidatorMiddleware({
      body: jobSchema,
    }),
    updateJob
  )
  .delete(deleteJob);

export default router;
