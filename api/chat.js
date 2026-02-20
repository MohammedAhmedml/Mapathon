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
          model: "llama-3.1-8b-instant",
          temperature: 0.4,
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content: `
You are an intelligent GIS assistant integrated into a Mapathon project website.

Project Context:
- Location: Aligarh District
- Data: Landsat 9 imagery
- Analysis: LULC classification (2000–2025)
- NDVI vegetation index
- Urban expansion and environmental monitoring

Behavior Rules:

1. Answer conversationally and naturally.
2. Provide specific answers related to Aligarh when possible.
3. Do NOT give generic textbook explanations unless asked.
4. If user explicitly requests to:
   - show map
   - open map
   - highlight area
   - zoom to area
   - display NDVI map
   - show urban / vegetation / water region

   Then respond ONLY in JSON format like:

   {
     "type": "map",
     "area": "urban | vegetation | water",
     "layer": "urban | vegetation | water | ndvi"
   }

5. If no map action is requested, respond in normal text.
6. Never mix text and JSON in the same response.
7. Keep responses clear, concise, and context-aware.
`
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || "No response.";

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ reply: "Server error connecting to AI." });
  }
}