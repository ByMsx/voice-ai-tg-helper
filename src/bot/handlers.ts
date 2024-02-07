import { AiMode, MyContext, ReplyMode } from '../types';
import { Filter, InputFile, NextFunction } from 'grammy';
import { speech2text, text2speech } from 'yandex-speech-promise';
import { AI_MODE, AI_ROLE, REPLY_MODE, YANDEX_API_KEY } from '../constants';
import { askAi } from '../gpt/yandex-gpt';
import removeMarkdown from 'remove-markdown';

export function recognizeVoiceMiddleware(token: string) {
  return async (ctx: MyContext, next: NextFunction) => {
    const { file_path: filePath } = await ctx.getFile();
    const response = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    ctx.text = await speech2text(buffer, {
      auth: `Api-Key ${YANDEX_API_KEY}`,
    });

    await next();
  };
}

export function pickText(ctx: Filter<MyContext, 'message'>, next: NextFunction) {
  ctx.text = ctx.msg.text;
  return next();
}

export async function handleMessage(ctx: Filter<MyContext, 'message'>, next: NextFunction) {
  if (!ctx.text) return;

  let roleOrContext;
  if (AI_MODE === AiMode.CHAT && ctx.session.aiContext && ctx.session.aiContext.length > 0) {
    roleOrContext = ctx.session.aiContext;
  } else {
    roleOrContext = AI_ROLE!;
  }

  const { response: responseText, context } = await askAi(ctx.text, roleOrContext);
  ctx.session.aiContext = context;

  if (!responseText) return;

  if (
    REPLY_MODE === ReplyMode.VOICE ||
    (REPLY_MODE === ReplyMode.VOICE_TO_VOICE && !!ctx.msg.voice)
  ) {
    const buffer = await text2speech(removeMarkdown(responseText), {
      auth: `Api-Key ${YANDEX_API_KEY}`,
      emotion: 'good',
      lang: 'ru-RU',
      voice: 'oksana',
    });

    await ctx.replyWithVoice(new InputFile(buffer));
  } else {
    await ctx.reply(responseText, { parse_mode: 'Markdown' });
  }

  return next();
}

export function resetContext(ctx: MyContext, next: NextFunction) {
  ctx.session.aiContext = undefined;
  return next();
}

export const sendWelcomeMessage = async (ctx: MyContext) =>
  ctx.reply(
    'Привет!' +
      '\nЯ помощник с искусственным интеллектом: я умею слушать твои голосовые и отвечать на них через Yandex GPT.' +
      '\nМы предоставляем несколько ознакомительных запросов, используйте их, чтобы попробовать.' +
      '\nВы можете развернуть такого же бота для себя: https://t.me/lebedevprogrammer/60',
  );
