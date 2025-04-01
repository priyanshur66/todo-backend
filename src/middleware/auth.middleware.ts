import { Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { AuthenticatedRequest } from '../types'; 

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const payload = authService.verifyToken(token);

  if (!payload) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = payload; 
  next(); 
};

export default authenticateToken;