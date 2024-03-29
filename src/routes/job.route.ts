import { Router } from 'express';
import {
  createJob,
  deleteJobs,
  deleteJob,
  getJobs,
  getJob,
  updateJob,
  showStats,
} from '../controllers/job.controller';
import requestValidatorMiddleware from '../middleware/requestValidator.middleware';
import testUserMiddleware from '../middleware/testUser.middleware';
import { jobSchema, jobParamsSchema } from '../schemas/job.schema';

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
    createJob
  )
  .get(getJobs)
  .delete(testUserMiddleware, deleteJobs);

router.get('/stats', showStats);

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
    [
      requestValidatorMiddleware({
        body: jobSchema,
      }),
      testUserMiddleware,
    ],
    updateJob
  )
  .delete(testUserMiddleware, deleteJob);

export default router;
