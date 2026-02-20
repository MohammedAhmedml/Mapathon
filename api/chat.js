export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a professional geospatial assistant. Provide short, clear explanations about LULC (Land Use Land Cover), NDVI, satellite imagery, and environmental analysis. Keep responses concise and educational."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.4,
          max_tokens: 150
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({
        reply: data.error.message || "Groq API error."
      });
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        reply: "Unexpected API response."
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      reply: "Server error connecting to Groq."
    });
  }
}