import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';
import { IMessagesRepository } from '../repositories/messages.repository.interface';

export class MessagesService {
  constructor(private readonly repository: IMessagesRepository) {}

  async getAll(): Promise<Message[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<Message | null> {
    const message = await this.repository.findById(id);
    if (!message) {
      throw new Error('Message not found');
    }
    return message;
  }

  async create(data: CreateMessageDto): Promise<Message> {
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('Text is required');
    }
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateMessageDto): Promise<Message> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Message not found');
    }

    if (data.text !== undefined && data.text.trim().length === 0) {
      throw new Error('Text cannot be empty');
    }

    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new Error('Failed to update message');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Message not found');
    }
    await this.repository.delete(id);
  }
}
