export interface Message {
  id: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageDto {
  text: string;
}

export interface UpdateMessageDto {
  text?: string;
}
