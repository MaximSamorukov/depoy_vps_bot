import { Context } from 'telegraf';

export function registerStartHandler(bot: any): void {
  bot.command('start', (ctx: Context) => {
    ctx.reply('Добавьте сообщение или просмотрите список добавленных сообщений', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Список', callback_data: 'list_messages' },
            { text: 'Добавить', callback_data: 'add_message' },
          ],
        ],
      },
    });
  });
}
