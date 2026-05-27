import express from 'express';
import { config } from './config';
import eventRoutes from './routes/event.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { EventController } from './controllers/event.controller';
import mongoose from 'mongoose';
import cors from 'cors';
import { register } from './metrics';
import { metricsMiddleware } from './middlewares/metricsMiddleware';
class App {
    public app: express.Application;
    private eventController: EventController;
    constructor() {
        this.app = express();
        
        this.app.use(cors({
            origin: 'http://localhost:4200',
            credentials: true
        }));
        this.app.use(express.json());
        this.app.use(metricsMiddleware);
        this.app.get('/metrics', async (_req, res) => {
            res.set('Content-Type', register.contentType);
            res.end(await register.metrics());
        });
        this.initializeRoutes();
        this.connectToDatabase();
        
    }
    private initializeRoutes() {
        
        this.app.use('/api/events', eventRoutes);
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/users', userRoutes); 
        
        this.app.use((req, res) => {
            res.status(404).json({ message: 'Endpoint nie istnieje' });
        });
    }

    private async connectToDatabase(): Promise<void> {
        try {
            await mongoose.connect(config.databaseUrl);
            console.log('Connection with database established');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }

        mongoose.connection.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
    }   

    public listen(): void {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        });
    }
}
export default new App().app;