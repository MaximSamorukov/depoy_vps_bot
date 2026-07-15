import { v4 as uuidv4 } from 'uuid';
import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';
import { IMessagesRepository } from './messages.repository.interface';

export class InMemoryMessagesRepository implements IMessagesRepository {
  private messages: Map<string, Message> = new Map();

  async findAll(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async findById(id: string): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async create(data: CreateMessageDto): Promise<Message> {
    const now = new Date();
    const message: Message = {
      id: uuidv4(),
      text: data.text,
      createdAt: now,
      updatedAt: now,
    };
    this.messages.set(message.id, message);
    return message;
  }

  async update(id: string, data: UpdateMessageDto): Promise<Message | null> {
    const existing = this.messages.get(id);
    if (!existing) {
      return null;
    }

    const updated: Message = {
      ...existing,
      text: data.text ?? existing.text,
      updatedAt: new Date(),
    };
    this.messages.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }
}
