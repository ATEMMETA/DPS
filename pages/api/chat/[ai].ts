import { createClient } from '@vercel/ai';

export default async function handler(req, res) {
  const { ai } = req.query;
  let client;

  switch (ai) {
    case 'grok':
      client = createClient('xai', { apiKey: process.env.GROK_API_KEY });
      break;
    case 'gemini':
      client = createClient('google', { apiKey: process.env.GEMINI_API_KEY });
      break;
    case 'gpt':
      client = createClient('openai', { apiKey: process.env.GPT_API_KEY });
      break;
    case 'serveo':
      client = createClient('serveo', { apiKey: process.env.SERVEO_API_KEY }); // Adjust provider
      break;
    default:
      return res.status(404).json({ error: 'AI not found' });
  }

  const { message } = req.body;
  const response = await client.chat(message);
  res.json({ reply: response });
}
