// /.netlify/functions/ideas
// Serverless endpoint that takes {query} and returns 5 Milo-safe ideas using OpenAI.
// Keep your API key safe by setting OPENAI_API_KEY in Netlify → Site settings → Environment variables.

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const query = (body.query || "general daily enrichment for a lovable black pug named Milo").toString().slice(0, 200);

    const prompt = `You are a positive, safety-first dog trainer writing for a small black pug named Milo.
Return 5 short enrichment ideas tailored to: "${query}".
Each idea: a title (4-6 words) + one concise sentence with steps. Avoid unsafe foods or overexertion. Prefer indoor-friendly, Montana-weather-aware ideas when relevant.`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      return {
        statusCode: r.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "OpenAI API error", details: errText })
      };
    }

    const data = await r.json();

    // Try to read Responses API "output_text" if present, else fall back to common fields.
    const outputText = (data.output_text) ||
                       (Array.isArray(data.output) && data.output[0]?.content?.[0]?.text) ||
                       (data.choices && data.choices[0]?.message?.content) ||
                       JSON.stringify(data);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideasText: outputText })
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};