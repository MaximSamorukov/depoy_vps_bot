import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './config/swagger';
import { errorHandler } from './middleware/error-handler';
import { createMessagesRoutes } from './routes/messages.routes';
import { MessagesController } from './controllers/messages.controller';
import { MessagesService } from './services/messages.service';
import { PostgresMessagesRepository } from './repositories/postgres-messages.repository';

export const createApp = () => {
  const repository = new PostgresMessagesRepository();
  const service = new MessagesService(repository);
  const controller = new MessagesController(service);

  const app = express();
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: false,
    })
  );
  app.use(express.json());

  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use('/api/messages', createMessagesRoutes(controller));

  app.use(errorHandler);

  return app;
};
