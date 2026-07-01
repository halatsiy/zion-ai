export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use a POST request with a JSON body."
    });
  }

  try {
    const userMessage = req.body?.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Missing 'message' in request body."
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
