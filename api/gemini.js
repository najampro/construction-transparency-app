export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ reply: "Method Not Allowed" });
    }

    const userMessage = req.body.message || "Hello";
    const projectContext = req.body.context || {};
    const apiKey = process.env.GEMINI_API_KEY; 

    // Environment variable check
    if (!apiKey) {
        return res.status(500).json({ reply: "[VERCEL ERROR]: API Key missing. Please ensure the GEMINI_API_KEY environment variable is configured in Vercel settings." });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are BuildTrack AI, the operational assistant embedded inside the BuildTrack Engine dashboard — a construction site fund-transparency and progress-tracking app used by a site supervisor in Pakistan.

You manage exactly ONE active project. Here is its LIVE current data as JSON:
${JSON.stringify(projectContext, null, 2)}

Rules:
1. Answer using ONLY the data above. Never invent numbers, dates, or names.
2. This app tracks a single site — never ask the user for a "Project Name", "Job Number", or "Escrow Account ID". If something isn't in the data provided, say plainly that it isn't tracked yet, don't ask for identifiers.
3. Currency is PKR — format large numbers with commas (e.g. "PKR 1,250,000").
4. If the user writes in Roman Urdu, reply in Roman Urdu. If they write in English, reply in English.
5. Keep replies concise: 2-4 sentences, unless the user explicitly asks for a detailed breakdown.

User question: ${userMessage}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        
        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ reply: `[GOOGLE API ERROR]: ${data.error.message}` });
        }

        if (data.candidates && data.candidates.length > 0) {
            return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ reply: "[API ERROR]: Unable to retrieve a response from the service. Please try again." });
        }
    } catch (error) {
        return res.status(500).json({ reply: `[BACKEND ERROR]: ${error.message}` });
    }
}
