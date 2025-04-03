import express, { Request, Response, NextFunction } from 'express';
import  cors from 'cors';
import config from './config/config';
import getPool from './utils/db';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { AppConfig } from './types'; 

const app = express();
const port = config.port;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));


const checkDbConnection = async () => {
  try {
    const pool = await getPool();
    const client = await pool.connect();
    console.log('Database connected successfully.');
    client.release();
  } catch (error) {
    console.error('!!! Failed to connect to the database:', error);
   
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send(`Todo Backend API is running on port ${port}! Environment: ${config.env}`);
});

app.use('/auth', authRoutes);

app.use('/api/v1/tasks', taskRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Not Found' });
});


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err.stack || err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500; 
  res.status(statusCode).json({
      message: err.message || 'Internal Server Error',
      ...(config.env === 'development' && { stack: err.stack }), 
  });
});


app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await checkDbConnection(); 
});