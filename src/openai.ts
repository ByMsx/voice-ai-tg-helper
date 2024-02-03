import { HttpsProxyAgent } from 'https-proxy-agent';
import OpenAI from 'openai';
import { HTTP_PROXY_URL, OPENAI_API_KEY } from './constants';

const httpsProxyAgent = new HttpsProxyAgent(HTTP_PROXY_URL!);

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  httpAgent: httpsProxyAgent,
});

export async function askAi(text: string, role: string) {
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0613',
    messages: [
      {
        role: 'system',
        content: role,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    stream: false,
  });

  return aiResponse.choices?.[0]?.message?.content;
}
