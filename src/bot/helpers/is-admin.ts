import { NextFunction } from 'grammy';
import { MyContext } from '../../types';
import { ADMINS_IDS } from '../../constants';

export function isAdmin(ctx: MyContext, next: NextFunction) {
  if (!ctx.from) return;
  if (!ADMINS_IDS.includes(ctx.from.id)) return;

  return next();
}
