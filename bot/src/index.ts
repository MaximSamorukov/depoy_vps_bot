import { bot } from './bot';
import { registerStartHandler } from './handlers/start';

registerStartHandler(bot);

async function main() {
  console.log('Starting bot...');
  
  await bot.launch({
    dropPendingUpdates: true,
  });
  
  console.log('Bot is running');
  
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
