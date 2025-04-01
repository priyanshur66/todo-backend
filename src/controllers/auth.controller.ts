import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { executeQuery } from '../utils/queryExecutor'; 
import authService from '../services/auth.service'; 
import { User } from '../types'; 

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, displayName, walletAddress } = req.body;

  try {
   
    const existingUser = await executeQuery<User>(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

  
    const hashedPassword = await authService.hashPassword(password);
    const userId = uuidv4(); 


    const newUser: Partial<User> = {
      user_id: userId,
      email: email,
      password: hashedPassword,
      display_name: displayName,
      wallet_address: walletAddress,
      user_status: 'active',
    };

    const columns = Object.keys(newUser).join(', ');
    const placeholders = Object.keys(newUser).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(newUser);

    await executeQuery(
      `INSERT INTO users (${columns}) VALUES (${placeholders})`,
      values
    );

    const userResponse: Partial<User> = { ...newUser };
    delete userResponse.password;

    res.status(201).json({ message: 'User registered successfully', user: userResponse });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: 'Error registering user', error: (error as Error).message });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const users = await executeQuery<User>(
      'SELECT user_id, email, password, display_name, user_status FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    const isMatch = await authService.comparePassword(password, user.password!); // Assert password is not undefined
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.user_status !== 'active') {
        return res.status(403).json({ message: 'User account is not active' });
    }

    const token = authService.generateToken(user);

     await executeQuery(
         'UPDATE users SET last_login_at = NOW() WHERE user_id = $1',
         [user.user_id]
     );

    const userResponse: Partial<User> = { ...user };
    delete userResponse.password;

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
      token: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Error logging in', error: (error as Error).message });
  }
};

export default {
  register,
  login,
};