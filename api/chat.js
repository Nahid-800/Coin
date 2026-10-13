// api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // এখানে আপনার Novita API Key বসান
  const API_KEY = process.env.NOVITA_API_KEY || 'sk_VPqx4oi03j2hWZsWy6Tky1ZQ748vKCI8SzJnsaFLBoU';

  try {
    const response = await fetch('https://api.novita.ai/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-v4.1-flash',
        messages: messages,          // কোনো system prompt নেই
        max_tokens: 196608,
        temperature: 1,
        top_p: 1,
        min_p: 0,
        top_k: 27,
        presence_penalty: 0,
        frequency_penalty: 0,
        repetition_penalty: 1,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Novita API Error:', errorText);
      return res.status(response.status).json({
        error: `API Error ${response.status}: ${errorText}`
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return res.status(200).json({ content });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
