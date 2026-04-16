import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTaskStatus
} from '../controllers/taskController';
import { validateRequest } from '../middleware/validateRequest';
import { createTaskSchema, updateStatusSchema } from '../validations/taskValidation';

const router = Router();

router.post('/', validateRequest(createTaskSchema), createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.patch('/:id/status', validateRequest(updateStatusSchema), updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
