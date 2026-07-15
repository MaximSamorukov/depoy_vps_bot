import { Request, Response, NextFunction } from 'express';
import { MessagesService } from '../services/messages.service';
import { CreateMessageDto, UpdateMessageDto } from '../models/message.model';

export class MessagesController {
  constructor(private readonly service: MessagesService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await this.service.getAll();
      res.json(messages);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.service.getById(req.params.id as string);
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.service.create(req.body as CreateMessageDto);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await this.service.update(
        req.params.id as string,
        req.body as UpdateMessageDto
      );
      res.json(message);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
