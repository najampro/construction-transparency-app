
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const userMessage = req.body.message;
    // Yeh line Vercel Hosting se aapka Environment Variable uthaye gi
    const apiKey = process.env.GEMINI_API_KEY; 

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const systemPrompt = `You are BuildTrack AI, a professional construction operational assistant. You help supervisors manage construction phases, optimize costs, and track escrow budgets. Reply concisely in a mix of English and Roman Urdu. The user just said: ${userMessage}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ reply: "Error reading API data." });
        }
    } catch (error) {
        res.status(500).json({ reply: "Backend connection failed." });
    }
}
