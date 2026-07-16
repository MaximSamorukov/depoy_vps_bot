import { Message, CreateMessageDto, UpdateMessageDto } from '../models/message.model';
import { IMessagesRepository } from './messages.repository.interface';
import { pool } from '../config/database';

export class PostgresMessagesRepository implements IMessagesRepository {
  async findAll(): Promise<Message[]> {
    const result = await pool.query<Message>(
      'SELECT id, message, created_at as "createdAt", updated_at as "updatedAt" FROM messages ORDER BY id'
    );
    return result.rows;
  }

  async findById(id: number): Promise<Message | null> {
    const result = await pool.query<Message>(
      'SELECT id, message, created_at as "createdAt", updated_at as "updatedAt" FROM messages WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: CreateMessageDto): Promise<Message> {
    const result = await pool.query<Message>(
      `INSERT INTO messages (message, created_at, updated_at) 
       VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, message, created_at as "createdAt", updated_at as "updatedAt"`,
      [data.message]
    );
    return result.rows[0];
  }

  async update(id: number, data: UpdateMessageDto): Promise<Message | null> {
    const result = await pool.query<Message>(
      `UPDATE messages 
       SET message = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING id, message, created_at as "createdAt", updated_at as "updatedAt"`,
      [data.message, id]
    );
    return result.rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM messages WHERE id = $1', [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }
}
