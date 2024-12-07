import { Filter, NextFunction } from 'grammy';
import { MyContext } from '../types';
import { AppDataSource } from '../data-source';
import { User } from '../database/models/user';
import dayjs from 'dayjs';
import { UserRepository } from '../database/repositories/user.repository';

export async function userStartedBot(ctx: MyContext, next: NextFunction) {
  if (!ctx.from) return next();

  const user = await UserRepository.findOrCreate(
    {
      telegramUserId: ctx.from.id.toString(),
    },
    {
      telegramUserId: ctx.from.id.toString(),
      username: ctx.from.username ?? null,
      firstName: ctx.from.first_name,
    },
  );

  await UserRepository.save(user);

  return next();
}

export async function saveUserRequest(ctx: Filter<MyContext, 'message'>, next: NextFunction) {
  const repository = AppDataSource.getRepository(User);

  const user = await UserRepository.findOrCreate(
    {
      telegramUserId: ctx.from.id.toString(),
    },
    {
      telegramUserId: ctx.from.id.toString(),
      username: ctx.from.username ?? null,
      firstName: ctx.from.first_name,
    },
  );

  user.requestsCount++;
  user.username = ctx.from.username ?? null;

  await repository.save(user);

  return next();
}

export async function printStats(ctx: MyContext, _next: NextFunction) {
  const users = await UserRepository.find({
    order: {
      updatedAt: 'desc',
    },
  });

  const rows = users.map(
    user =>
      `<a href="tg://user?id=${user.id}">${user.firstName}</a>: ${user.requestsCount} - последний ${dayjs(user.updatedAt).format('DD.MM.YYYY')}`,
  );

  const header = `📊 <b>Статистика использования</b>\n\nВсего пользователей: <b>${rows.length}</b>\n\n`;

  let start = 0;
  let array: string[];
  while ((array = rows.slice(start, start + 30)).length > 0) {
    const text =
      (start === 0 ? header : '') +
      array.map((str, idx) => `<b>${idx + 1 + start}.</b> ${str}`).join('\n');
    await ctx.reply(text, { parse_mode: 'HTML' });

    start += 30;
  }
}
