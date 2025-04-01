import { Request } from 'express';

export * from './config.types';

export interface User {
  user_id: string;
  wallet_address?: string | null;
  display_name?: string | null;
  email?: string | null;
  password?: string; 
  avatar_url?: string | null;
  user_status: string;
  last_login_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Task {
  task_id: string;
  user_id: string;
  task_name: string;
  task_description: string;
  task_status: string; 
  task_priority: string; 
  task_blockchain_hash: string; 
  task_category: string;
  task_due_date: Date | string; 
  created_at?: Date;
  updated_at?: Date;
}

export interface JwtPayload {
  userId: string;
  email?: string | null;
}

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload; 
}