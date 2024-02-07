import { Context, SessionFlavor } from 'grammy';
import { AiChatContext } from './gpt/yandex-gpt';

export enum ReplyMode {
  TEXT = 'text',
  VOICE = 'voice',
  VOICE_TO_VOICE = 'voice-to-voice',
}

export enum AiMode {
  PROMPT = 'prompt',
  CHAT = 'chat',
}

export interface SessionData {
  requestsLeft: number;
  aiContext?: AiChatContext; // TODO: add AiChatContext from ChatGPT
}

export type MyContext = Context & { text?: string } & SessionFlavor<SessionData>;
