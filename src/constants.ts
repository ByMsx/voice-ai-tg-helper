import dotenv from 'dotenv';
import { ResponseMode } from './types';

dotenv.config();

export const {
  YANDEX_FOLDER_ID,
  YANDEX_API_KEY,
  OPENAI_API_KEY,
  BOT_TOKEN,
  HTTP_PROXY_URL,
  AI_ROLE,
} = process.env;

export const REPLY_MODE = (process.env.REPLY_MODE as ResponseMode) || ResponseMode.TEXT;

export const UNLIMITED_USER_IDS = process.env.UNLIMITED_USER_IDS?.split(',').map(v => +v) || [];
