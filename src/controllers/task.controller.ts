import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../utils/queryExecutor'; 
import { Task, AuthenticatedRequest } from '../types';

const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId; 
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    const { task_name, task_description, task_status, task_priority, task_blockchain_hash, task_category, task_due_date } = req.body;
    const taskId = uuidv4(); 

    try {
        const newTask: Omit<Task, 'created_at' | 'updated_at'> = {
            task_id: taskId,
            user_id: userId,
            task_name,
            task_description,
            task_status,
            task_priority,
            task_blockchain_hash,
            task_category,
            task_due_date: new Date(task_due_date), 
        };

        const columns = Object.keys(newTask).join(', ');
        const placeholders = Object.keys(newTask).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(newTask);

        await executeQuery(
            `INSERT INTO tasks (${columns}) VALUES (${placeholders})`,
            values
        );

         const createdTask = await executeQuery<Task>(
             'SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2',
             [taskId, userId]
         );

        res.status(201).json({ message: 'Task created successfully', task: createdTask[0] });
    } catch (error) {
         console.error("Create Task Error:", error);
         res.status(500).json({ message: 'Error creating task', error: (error as Error).message });
    }
};

const getAllTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
     if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    try {
        const tasks = await executeQuery<Task>(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Get All Tasks Error:", error);
        res.status(500).json({ message: 'Error fetching tasks', error: (error as Error).message });
    }
};

const getTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { taskId } = req.params;

     if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    try {
        const tasks = await executeQuery<Task>(
            'SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2',
            [taskId, userId]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found or you do not have permission' });
        }

        res.status(200).json(tasks[0]);
    } catch (error) {
         console.error("Get Task By ID Error:", error);
         res.status(500).json({ message: 'Error fetching task', error: (error as Error).message });
    }
};

const updateTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { taskId } = req.params;
    const updates = req.body;

     if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    if (Object.keys(updates).length === 0) {
         return res.status(400).json({ message: 'No update fields provided' });
    }

    if (updates.task_due_date) {
        updates.task_due_date = new Date(updates.task_due_date);
    }
    updates.updated_at = new Date();

    try {
         // Check if task exists and belongs to the user
        const existingTask = await executeQuery<Task>(
            'SELECT task_id FROM tasks WHERE task_id = $1 AND user_id = $2',
            [taskId, userId]
        );

        if (existingTask.length === 0) {
            return res.status(404).json({ message: 'Task not found or you do not have permission' });
        }


        const updateFields = Object.keys(updates)
                                  .map((key, i) => `${key} = $${i + 1}`)
                                  .join(', ');
        const updateValues = Object.values(updates);

        const query = `UPDATE tasks SET ${updateFields} WHERE task_id = $${updateValues.length + 1} AND user_id = $${updateValues.length + 2} RETURNING *`;
        const updatedTasks = await executeQuery<Task>(query, [...updateValues, taskId, userId]);


        res.status(200).json({ message: 'Task updated successfully', task: updatedTasks[0] });
    } catch (error) {
         console.error("Update Task Error:", error);
         res.status(500).json({ message: 'Error updating task', error: (error as Error).message });
    }
};

const deleteTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const { taskId } = req.params;

     if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }

    try {
        const result = await executeQuery(
            'DELETE FROM tasks WHERE task_id = $1 AND user_id = $2',
            [taskId, userId]
        );

         


        res.status(200).json({ message: 'Task deleted successfully' }); // 200 or 204 No Content
    } catch (error) {
         console.error("Delete Task Error:", error);
         res.status(500).json({ message: 'Error deleting task', error: (error as Error).message });
    }
};

export default {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
};