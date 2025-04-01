//@ts-nocheck

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { User, JwtPayload } from '../types'; 

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (
  plainText: string,
  hashed: string
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.user_id,
    email: user.email, 
  };
  return jwt.sign(payload, config.jwt.secret as jwt.Secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
};

export default {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};