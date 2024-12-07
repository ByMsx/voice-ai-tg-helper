import { MyContext, SessionData } from '../types';
import { Bot, session } from 'grammy';
import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { checkLimit, decreaseLimit } from './limits';
import {
  handleMessage,
  pickText,
  recognizeVoiceMiddleware,
  resetContext,
  sendWelcomeMessage,
} from './handlers';
import { DISABLE_LIMITS } from '../constants';
import { freeStorage } from '@grammyjs/storage-free';
import { printStats, saveUserRequest, userStartedBot } from './usage-stats';

export default function createBot(token: string) {
  const bot = new Bot<MyContext>(token);

  bot.use(generateUpdateMiddleware());
  bot.use(
    session({
      initial: () => ({
        requestsLeft: 5,
      }),
      // todo: TypeOrm Storage
      storage: freeStorage<SessionData>(token),
    }),
  );

  bot.command('start', resetContext, userStartedBot, sendWelcomeMessage);
  bot.command('stats', printStats);

  bot.on(
    'message:voice',
    ...(DISABLE_LIMITS ? [] : [checkLimit]),
    recognizeVoiceMiddleware(token),
    handleMessage,
    ...(DISABLE_LIMITS ? [] : [decreaseLimit]),
    saveUserRequest,
  );

  bot.on(
    'message',
    ...(DISABLE_LIMITS ? [] : [checkLimit]),
    pickText,
    handleMessage,
    ...(DISABLE_LIMITS ? [] : [decreaseLimit]),
    saveUserRequest,
  );

  return bot;
}
