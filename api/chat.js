export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are a geospatial assistant. Give brief, clear explanations about LULC, NDVI, satellite imagery, and environmental analysis."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.5,
        max_tokens: 150
      })
    });

    const data = await response.json();

    res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response."
    });

  } catch (error) {
    res.status(500).json({ reply: "Error connecting to Groq API." });
  }
}