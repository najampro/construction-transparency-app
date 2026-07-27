export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method Not Allowed" });
    }

    const userMessage = req.body.message || "Hello";
    const apiKey = process.env.GEMINI_API_KEY; 

    // Agar Vercel mein key save nahi hui hogi toh yeh error aayega
    if (!apiKey) {
        return res.status(500).json({ reply: "[VERCEL ERROR]: API Key is missing! Environment variable Vercel mein nahi mila." });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
    const systemPrompt = `You are BuildTrack AI, a professional construction operational assistant. Reply concisely. The user just said: ${userMessage}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        
        const data = await response.json();
        
        // Agar Google Gemini API key ya data reject karta hai
        if (data.error) {
            return res.status(500).json({ reply: `[GOOGLE API ERROR]: ${data.error.message}` });
        }

        // Agar response theek aata hai
        if (data.candidates && data.candidates.length > 0) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ reply: "[API ERROR]: No reply from Google." });
        }
    } catch (error) {
        // Agar Vercel ka server crash ho
        return res.status(500).json({ reply: `[BACKEND CRASH]: ${error.message}` });
    }
}
