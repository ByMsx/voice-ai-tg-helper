import { MyContext } from '../types';
import { Filter, NextFunction } from 'grammy';
import { UNLIMITED_USER_IDS } from '../constants';

function isUserUnlimited(userId: number) {
  return UNLIMITED_USER_IDS.indexOf(userId) >= 0;
}

export function decreaseLimit(ctx: MyContext, next: NextFunction) {
  ctx.session.requestsLeft--;

  return next();
}

export function checkLimit(ctx: Filter<MyContext, 'message'>, next: NextFunction) {
  if (!isUserUnlimited(ctx.from.id) && ctx.session.requestsLeft <= 0) {
    return ctx.reply(
      'У вас закончились ознакомительные запросы. Обратитесь к @itsvobodaru за подпиской',
    );
  }

  return next();
}
