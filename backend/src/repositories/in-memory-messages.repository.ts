import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';
import { IMessagesRepository } from './messages.repository.interface';

export class InMemoryMessagesRepository implements IMessagesRepository {
  private messages: Map<number, Message> = new Map();
  private nextId = 1;

  async findAll(): Promise<Message[]> {
    return Array.from(this.messages.values());
  }

  async findById(id: number): Promise<Message | null> {
    return this.messages.get(id) || null;
  }

  async create(data: CreateMessageDto): Promise<Message> {
    const now = new Date();
    const message: Message = {
      id: this.nextId++,
      message: data.message,
      createdAt: now,
      updatedAt: now,
    };
    this.messages.set(message.id, message);
    return message;
  }

  async update(id: number, data: UpdateMessageDto): Promise<Message | null> {
    const existing = this.messages.get(id);
    if (!existing) {
      return null;
    }

    const updated: Message = {
      ...existing,
      message: data.message ?? existing.message,
      updatedAt: new Date(),
    };
    this.messages.set(id, updated);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }
}
