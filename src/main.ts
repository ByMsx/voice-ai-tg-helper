import { Bot, InputFile } from 'grammy';
import { speech2text, text2speech } from 'yandex-speech-promise';
import { generateUpdateMiddleware } from 'telegraf-middleware-console-time';
import { askAi } from './yandex-gpt';
import removeMarkdown from 'remove-markdown';
import { BOT_TOKEN, YANDEX_API_KEY } from './constants';

const AI_ROLE = 'Ты профессиональный секретарь. В ответе не используй форматирование.';

async function handleNewVoiceMessage(url: string) {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());

  const text = await speech2text(buffer, {
    auth: `Api-Key ${YANDEX_API_KEY}`,
  });

  return askAi(text, AI_ROLE);
}

function createBot(token: string) {
  const bot = new Bot(token);

  bot.use(generateUpdateMiddleware());

  bot.on('message:voice', async ctx => {
    const { file_path: filePath } = await ctx.getFile();
    const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    const responseText = await handleNewVoiceMessage(fileUrl);
    if (!responseText) return;

    const buffer = await text2speech(removeMarkdown(responseText), {
      auth: `Api-Key ${YANDEX_API_KEY}`,
      emotion: 'good',
      lang: 'ru-RU',
      voice: 'oksana',
    });

    return ctx.replyWithVoice(new InputFile(buffer));
  });

  return bot;
}

function main() {
  const bot = createBot(BOT_TOKEN!);

  return bot.start({
    onStart: botInfo => console.log(`Bot started under ${botInfo.username}`),
    allowed_updates: ['message'],
    drop_pending_updates: true,
  });
}

main();
