import { Context } from 'telegraf';
import { getMessages, addMessage } from '../api/messages';

export function registerCallbackHandler(bot: any): void {
  bot.on('callback_query', async (ctx: Context) => {
    const query = ctx.callbackQuery as any;
    const data = query.data;

    if (data === 'list_messages') {
      const messages = getMessages();
      
      if (messages.length === 0) {
        await ctx.answerCbQuery('Список сообщений пуст');
      } else {
        const messageList = messages
          .map((m) => `${m.id}. ${m.message}`)
          .join('\n');
        await ctx.editMessageText(`Список сообщений:\n\n${messageList}`, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Список', callback_data: 'list_messages' },
                { text: 'Добавить', callback_data: 'add_message' },
              ],
            ],
          },
        });
      }
    } else if (data === 'add_message') {
      await ctx.answerCbQuery('Отправьте сообщение, которое хотите добавить');
    }
  });
}
