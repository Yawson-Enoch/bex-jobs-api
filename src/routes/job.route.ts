import { Router } from 'express';
import {
  createJob,
  deleteJob,
  deleteJobs,
  getJob,
  getJobs,
  showStats,
  updateJob,
} from '../controllers/job.controller';
import requestValidatorMiddleware from '../middleware/requestValidator.middleware';
import testUserMiddleware from '../middleware/testUser.middleware';
import { jobParamsSchema, jobSchema } from '../schemas/job.schema';

const router = Router();

router
  .route('/')
  .post(
    [
      requestValidatorMiddleware({
        body: jobSchema,
      }),
      testUserMiddleware,
    ],
    createJob,
  )
  .get(getJobs)
  .delete(testUserMiddleware, deleteJobs);

router.get('/stats', showStats);

router.use(
  '/:jobID',
  requestValidatorMiddleware({
    params: jobParamsSchema,
  }),
);

router
  .route('/:jobID')
  .get(getJob)
  .patch(
    [
      requestValidatorMiddleware({
        body: jobSchema,
      }),
      testUserMiddleware,
    ],
    updateJob,
  )
  .delete(testUserMiddleware, deleteJob);

export default router;
