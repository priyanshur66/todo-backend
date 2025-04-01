import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validate = (schema: Record<string, Joi.Schema>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validSchema = Joi.object(schema).unknown(); 
    const { value, error } = validSchema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
    }, { abortEarly: false }); 

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      
      res.status(400).json({ message: `Validation error: ${errorMessage}` });
      
      return;
    }

    
    return next(); 
  };

export default validate;