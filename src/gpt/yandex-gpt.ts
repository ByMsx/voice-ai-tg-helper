import {
  YANDEX_API_KEY,
  YANDEX_FOLDER_ID,
  YANDEX_MAX_TOKENS,
  YANDEX_TEMPERATURE,
} from '../constants';

export async function askAi(text: string, role: string): Promise<string> {
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
      messages: [
        {
          role: 'system',
          text: role,
        },
        {
          role: 'user',
          text,
        },
      ],
    }),
  });

  const json = await response.json();
  return json.result.alternatives[0].message.text;
}
