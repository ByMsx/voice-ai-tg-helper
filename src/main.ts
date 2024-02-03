import { BOT_TOKEN } from './constants';
import { createBot } from './bot';

function main() {
  const bot = createBot(BOT_TOKEN!);

  return bot.start({
    onStart: botInfo => console.log(`Bot started under ${botInfo.username}`),
    allowed_updates: ['message'],
    drop_pending_updates: true,
  });
}

main();
