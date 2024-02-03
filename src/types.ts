import { Context, SessionFlavor } from 'grammy';

export enum ResponseMode {
  TEXT = 'text',
  VOICE = 'voice',
  VOICE_TO_VOICE = 'voice-to-voice',
}

export interface SessionData {
  requestsLeft: number;
}

export type MyContext = Context & { text?: string } & SessionFlavor<SessionData>;
