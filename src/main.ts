import 'reflect-metadata';
import { BOT_TOKEN } from './constants';
import { createBot } from './bot';
import { AppDataSource } from './data-source';

async function main() {
  await AppDataSource.initialize();

  const bot = createBot(BOT_TOKEN!);

  process.on('SIGTERM', () => {
    console.log('exit handler');
    bot.stop();
  });

  return bot.start({
    onStart: botInfo => console.log(`Bot started under ${botInfo.username}`),
    allowed_updates: ['message'],
    drop_pending_updates: true,
  });
}

main();
