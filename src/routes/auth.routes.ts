//@ts-nocheck
import express from 'express';
import authController from '../controllers/auth.controller';
import validate from '../middleware/validate.middleware';
import userValidation from '../validations/user.validation';

const router = express.Router();

router.post('/register', validate(userValidation.register), authController.register);
router.post('/login', validate(userValidation.login), authController.login);

export default router;