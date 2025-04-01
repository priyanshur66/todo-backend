import Joi from 'joi';

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    displayName: Joi.string().optional().allow(null, ''),
    walletAddress: Joi.string().optional().length(42).allow(null, ''), 
   
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export default {
  register,
  login,
};