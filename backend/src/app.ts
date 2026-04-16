import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/tasks', taskRoutes);

app.use(errorHandler);

export default app;
