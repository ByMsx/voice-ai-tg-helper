import { MyContext, SessionData } from '../types';
import { Bot, session } from 'grammy';
import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { checkLimit, decreaseLimit } from './limits';
import { freeStorage } from '@grammyjs/storage-free';
import { handleMessage, pickText, recognizeVoiceMiddleware, sendWelcomeMessage } from './handlers';

export default function createBot(token: string) {
  const bot = new Bot<MyContext>(token);

  bot.use(generateUpdateMiddleware());
  bot.use(
    session({
      initial: () => ({
        requestsLeft: 5,
      }),
      storage: freeStorage<SessionData>(token),
    }),
  );

  bot.command('start', sendWelcomeMessage);
  bot.on(
    'message:voice',
    checkLimit,
    recognizeVoiceMiddleware(token),
    handleMessage,
    decreaseLimit,
  );
  bot.on('message', checkLimit, pickText, handleMessage, decreaseLimit);

  return bot;
}
