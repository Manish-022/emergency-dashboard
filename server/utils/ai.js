const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function classifyIncident(description) {
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API Key not missing. Using mock classification.');
        const severities = ['Low', 'Medium', 'High'];
        const types = ['Medical', 'Fire', 'Police', 'Traffic'];
        return {
            severity: severities[Math.floor(Math.random() * severities.length)],
            type: types[Math.floor(Math.random() * types.length)]
        };
    }

    try {
        const prompt = `Analyze the following emergency incident description and provide a JSON response with:
    - severity: "Low", "Medium", or "High"
    - type: "Medical", "Fire", "Police", "Traffic", or "Other"
    
    Description: "${description}"
    
    Response format: {"severity": "...", "type": "..."}`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return result;
    } catch (error) {
        console.error('AI Classification Error:', error);
        return { severity: 'Medium', type: 'Other' }; // Fallback
    }
}

module.exports = { classifyIncident };
