export interface Message {
  id: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageDto {
  message: string;
}

export interface UpdateMessageDto {
  message?: string;
}
