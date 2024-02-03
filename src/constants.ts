import dotenv from 'dotenv';

dotenv.config();

export const { YANDEX_FOLDER_ID, YANDEX_API_KEY, OPENAI_API_KEY, BOT_TOKEN, HTTP_PROXY_URL } = process.env;
