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
            content: "You are a geospatial assistant. Give short, clear explanations about LULC, NDVI, and satellite analysis."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.4,
        max_tokens: 120
      })
    });

    const data = await response.json();

    // Debug log
    console.log("Groq Response:", data);

    if (data.error) {
      return res.status(500).json({ reply: data.error.message || "Groq API error." });
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: "Unexpected API response." });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ reply: "Server error connecting to Groq." });
  }
}