import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';

export interface IMessagesRepository {
  findAll(): Promise<Message[]>;
  findById(id: number): Promise<Message | null>;
  create(data: CreateMessageDto): Promise<Message>;
  update(id: number, data: UpdateMessageDto): Promise<Message | null>;
  delete(id: number): Promise<boolean>;
}
