import { Context } from 'telegraf';

export function registerStartHandler(bot: any): void {
  bot.on('message', (ctx: Context) => {
    ctx.reply('Привет');
  });
}
