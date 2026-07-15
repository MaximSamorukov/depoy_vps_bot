import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';

export interface IMessagesRepository {
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  create(data: CreateMessageDto): Promise<Message>;
  update(id: string, data: UpdateMessageDto): Promise<Message | null>;
  delete(id: string): Promise<boolean>;
}
