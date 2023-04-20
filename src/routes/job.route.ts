import { Router } from 'express';
import {
  createJob,
  deleteAllJobs,
  deleteJob,
  getAllJobs,
  getJob,
  updateJob,
} from '../controllers/job.controller';

const router = Router();

router.route('/').post(createJob).get(getAllJobs).delete(deleteAllJobs);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

export default router;
