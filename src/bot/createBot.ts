import { MyContext, SessionData } from '../types';
import { Bot, session } from 'grammy';
import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { checkLimit, decreaseLimit } from './limits';
import { freeStorage } from '@grammyjs/storage-free';
import {
  handleMessage,
  pickText,
  recognizeVoiceMiddleware,
  resetContext,
  sendWelcomeMessage,
} from './handlers';
import { DISABLE_LIMITS } from '../constants';

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

  bot.command('start', resetContext, sendWelcomeMessage);

  bot.on(
    'message:voice',
    ...(DISABLE_LIMITS ? [] : [checkLimit]),
    recognizeVoiceMiddleware(token),
    handleMessage,
    ...(DISABLE_LIMITS ? [] : [decreaseLimit]),
  );

  bot.on(
    'message',
    ...(DISABLE_LIMITS ? [] : [checkLimit]),
    pickText,
    handleMessage,
    ...(DISABLE_LIMITS ? [] : [decreaseLimit]),
  );

  return bot;
}
