import dotenv from 'dotenv';

dotenv.config();

export const config = {
  telegramBotToken: process.env.BOT_TOKEN,
};

if (!config.telegramBotToken) {
  throw new Error('BOT_TOKEN is not defined in environment variables');
}
