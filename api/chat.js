export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Explain briefly about LULC and NDVI. Question: ${message}`,
          parameters: { max_new_tokens: 120 }
        }),
      }
    );

    const data = await response.json();

    // Debug fallback handling
    if (data.error) {
      return res.status(500).json({ reply: "Model is loading or API error." });
    }

    if (Array.isArray(data) && data[0]?.generated_text) {
      return res.status(200).json({ reply: data[0].generated_text });
    }

    return res.status(500).json({ reply: "Unexpected response format." });

  } catch (error) {
    return res.status(500).json({ reply: "Server error connecting to AI." });
  }
}