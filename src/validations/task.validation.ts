import Joi from 'joi';

const createTask = {
    body: Joi.object().keys({
        task_name: Joi.string().required(),
        task_description: Joi.string().required(),
        task_status: Joi.string().required().valid('todo', 'in-progress', 'done'), 
        task_priority: Joi.string().required().valid('low', 'medium', 'high'), 
        task_blockchain_hash: Joi.string().required(), 
        task_category: Joi.string().required(),
        task_due_date: Joi.date().iso().required(), 
    }),
};

const updateTask = {
    params: Joi.object().keys({
        taskId: Joi.string().uuid().required(), 
    }),
    body: Joi.object().keys({
        task_name: Joi.string().optional(),
        task_description: Joi.string().optional(),
        task_status: Joi.string().optional().valid('todo', 'in-progress', 'done'),
        task_priority: Joi.string().optional().valid('low', 'medium', 'high'),
        task_blockchain_hash: Joi.string().optional(),
        task_category: Joi.string().optional(),
        task_due_date: Joi.date().iso().optional(),
    }).min(1),
};

 const getTask = {
    params: Joi.object().keys({
        taskId: Joi.string().uuid().required(), 
    }),
};

 const deleteTask = {
    params: Joi.object().keys({
        taskId: Joi.string().uuid().required(), 
    }),
};


export default {
    createTask,
    updateTask,
    getTask,
    deleteTask,
};