import { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { feedback } = req.body;

    if (!feedback || typeof feedback !== "string") {
        return res.status(400).json({ error: "Invalid feedback input" });
    }

    try {
        const prompt = `Analyze the following text: "${feedback}". 1. If the text does not resemble feedback notes intended for someone, respond with: "You provided something that does not look like feedback notes." 2. If the text resembles feedback notes, generate a formal and professional feedback summary based on the given notes. Ensure the summary is concise, actionable, and written in a positive tone.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content?.trim();
        res.status(200).json({ result: result || "No response generated." });
    } catch (error) {
        console.error("Error generating feedback:", error);
        res.status(500).json({ error: "Failed to generate feedback" });
    }
}