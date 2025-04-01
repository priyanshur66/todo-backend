//@ts-nocheck

import express from 'express';
import taskController from '../controllers/task.controller';
import authenticateToken from '../middleware/auth.middleware';
import validate from '../middleware/validate.middleware';
import taskValidation from '../validations/task.validation';

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authenticateToken);

router.post('/', validate(taskValidation.createTask), taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:taskId', validate(taskValidation.getTask), taskController.getTaskById);
router.put('/:taskId', validate(taskValidation.updateTask), taskController.updateTask);
router.delete('/:taskId', validate(taskValidation.deleteTask), taskController.deleteTask);

export default router;