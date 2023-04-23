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
import {
  createJobSchema,
  paramsSchema,
  updateJobSchema,
} from '../schemas/job.schema';

const router = Router();

router
  .route('/')
  .post(
    requestValidatorMiddleware({
      body: createJobSchema,
    }),
    createJob
  )
  .get(getAllJobs)
  .delete(deleteAllJobs);

router.use(
  '/:id',
  requestValidatorMiddleware({
    params: paramsSchema,
  })
);

router
  .route('/:id')
  .get(getJob)
  .patch(
    requestValidatorMiddleware({
      body: updateJobSchema,
    }),
    updateJob
  )
  .delete(deleteJob);

export default router;
