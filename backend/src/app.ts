import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger';
import { errorHandler } from './middleware/error-handler';
import { createMessagesRoutes } from './routes/messages.routes';
import { MessagesController } from './controllers/messages.controller';
import { MessagesService } from './services/messages.service';
import { InMemoryMessagesRepository } from './repositories/in-memory-messages.repository';

const repository = new InMemoryMessagesRepository();
const service = new MessagesService(repository);
const controller = new MessagesController(service);

const app = express();

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/messages', createMessagesRoutes(controller));

app.use(errorHandler);

export { app };
