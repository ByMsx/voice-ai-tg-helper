import dotenv from 'dotenv';
import { AiMode, ReplyMode } from './types';

dotenv.config();

export const {
  YANDEX_FOLDER_ID,
  YANDEX_API_KEY,
  OPENAI_API_KEY,
  BOT_TOKEN,
  HTTP_PROXY_URL,
  AI_ROLE,
  SQLITE_PATH = 'data/sqlite.db',
  YANDEX_MODEL = 'yandexgpt-lite',
} = process.env;

export const REPLY_MODE = (process.env.REPLY_MODE as ReplyMode) || ReplyMode.TEXT;
export const YANDEX_MAX_TOKENS = +(process.env.YANDEX_MAX_TOKENS || 100);
export const YANDEX_TEMPERATURE = parseFloat(process.env.YANDEX_TEMPERATURE || '0.1');
export const AI_MODE = (process.env.AI_MODE as AiMode) || AiMode.PROMPT;
export const DISABLE_LIMITS =
  process.env.DISABLE_LIMITS === 'true' || process.env.DISABLE_LIMITS === '1';
export const UNLIMITED_USER_IDS = process.env.UNLIMITED_USER_IDS?.split(',').map(v => +v) || [];

export const ADMINS_IDS = process.env.ADMINS_IDS?.split(',').map(v => +v) || [];
