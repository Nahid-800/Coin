export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  // CORS হেডার
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight request হ্যান্ডেল
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // সঠিক মডেল আইডি (inclusionai/ সহ)
    const { messages, model = "inclusionai/ling-3.0-flash-vl" } = req.body;

    // আপনার Novita API Key এখানে বসান অথবা Vercel Environment Variable এ NOVITA_API_KEY দিন
    const API_KEY = process.env.NOVITA_API_KEY || "sk_VPqx4oi03j2hWZsWy6Tky1ZQ748vKCI8SzJnsaFLBoU";

    const response = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 4096,
        temperature: 0.7,
        stream: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || data.error?.message || "Novita API Error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
