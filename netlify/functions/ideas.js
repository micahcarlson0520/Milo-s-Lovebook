// /.netlify/functions/ideas
// Uses native fetch + chat/completions (very compatible) and returns detailed errors to the page.

exports.handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const query = (body.query || "general daily enrichment for a lovable black pug named Milo")
      .toString()
      .slice(0, 200);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY on server" })
      };
    }

    const system = "You are a positive, safety-first dog trainer writing for a small black pug named Milo.";
    const user = `Return 5 short enrichment ideas tailored to: "${query}". Each idea: a title (4–6 words) + one concise sentence with steps. Avoid unsafe foods or overexertion.`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.8
      })
    });

    const text = await r.text(); // read raw text so we can show full error if needed
    if (!r.ok) {
      console.error("OpenAI API error:", r.status, text);
      return {
        statusCode: r.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "OpenAI API error", details: text })
      };
    }

    const data = JSON.parse(text);
    const ideasText = data?.choices?.[0]?.message?.content || "No ideas right now.";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideasText })
    };
  } catch (e) {
    console.error("Function failed:", e);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(e) })
    };
  }
};
