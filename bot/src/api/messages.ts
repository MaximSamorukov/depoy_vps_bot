import { Message } from '../types';

let messages: Message[] = [];
let nextId = 1;

export function getMessages(): Message[] {
  return messages;
}

export function addMessage(text: string): Message {
  const newMessage: Message = {
    id: nextId++,
    message: text,
  };
  messages.push(newMessage);
  return newMessage;
}
