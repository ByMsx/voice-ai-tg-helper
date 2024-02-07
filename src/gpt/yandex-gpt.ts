import {
  YANDEX_API_KEY,
  YANDEX_FOLDER_ID,
  YANDEX_MAX_TOKENS,
  YANDEX_TEMPERATURE,
} from '../constants';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  text: string;
}

export type AiChatContext = AiMessage[];

export async function askAi(
  text: string,
  arg: string | AiChatContext,
): Promise<{
  response: string;
  context: AiChatContext;
}> {
  const context =
    typeof arg === 'string'
      ? [
          {
            role: 'system',
            text: arg,
          },
        ]
      : arg;

  const userMessage = {
    role: 'user',
    text,
  };

  const messages = [...context, userMessage];

  const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${YANDEX_API_KEY}`,
      'x-folder-id': YANDEX_FOLDER_ID!,
    },
    body: JSON.stringify({
      modelUri: `gpt://${YANDEX_FOLDER_ID}/yandexgpt-lite`,
      completionOptions: {
        stream: false,
        temperature: YANDEX_TEMPERATURE,
        maxTokens: YANDEX_MAX_TOKENS,
      },
      messages,
    }),
  });

  const json = await response.json();
  const { message } = json.result.alternatives[0];

  return {
    response: message.text,
    context: [...messages, message],
  };
}
