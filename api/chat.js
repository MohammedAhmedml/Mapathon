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
          messages: [
            {
              role: "system",
              content: `
You are an intelligent GIS assistant embedded in a Mapathon project website.

Project Context:
- Location: Aligarh District
- Data Source: Landsat 9 OLI-2
- Analysis: LULC classification (2000–2025)
- Includes NDVI analysis and change detection.

Instructions:
- Answer specifically to the user’s question.
- Do NOT give generic textbook answers unless asked.
- If user mentions a location (e.g., urban area, vegetation, water body),
  respond clearly and explain what it means in the context of Aligarh.
- If user requests to "show area" or "highlight area",
  respond in JSON format:
  {
    "type": "map",
    "area": "name_of_area"
  }
Otherwise respond normally in text.
`
            },
            { role: "user", content: message }
          ],
          temperature: 0.3,
          max_tokens: 300
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