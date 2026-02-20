export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `
You are a professional geospatial AI assistant helping users understand LULC (Land Use Land Cover), NDVI, and satellite analysis for Aligarh District.

User question:
${message}
        `,
        parameters: { max_new_tokens: 200 }
      }),
    }
  );

  const data = await response.json();

  res.status(200).json({
    reply: data[0]?.generated_text || "No response from model."
  });
}
