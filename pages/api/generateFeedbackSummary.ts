import { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";

import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Use a secure environment variable
});

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

interface Feedback {
    feedback: string;
    // Add other properties your feedback object might have
    // For example: date?: Date; teamMemberId?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        try {
            const token = authHeader.split(" ")[1]
            await admin.auth().verifyIdToken(token);
        } catch {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const { feedbacks } = req.body as { feedbacks: Feedback[] };

            if (!feedbacks) {
                res.status(400).json({ error: "Feedbacks not provided" });
            }

            const prompt = `
            You are helping a manager write professional feedback for a team member. Based on the notes provided below, write a short feedback summary that is:
– Valuable (insightful and actionable)
– Constructive (includes areas for improvement)
– Positive (acknowledges strengths and contributions)

Use a clear, supportive, and professional tone appropriate for a performance review or one-on-one conversation.
Feedback notes:
${feedbacks.map((feedback, index) => `
--- Feedback ${index + 1} ---
${feedback.feedback}
`).join('')}
            `;

            console.log(prompt);

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are helping a manager write professional feedback for a team member" },
                    { role: "user", content: prompt },
                ],
                max_tokens: 150,
                temperature: 0.7,
            });

            console.log(response);

            const result = response.choices[0]?.message?.content?.trim();
            res.status(200).json({ result: result || "No response generated." });
        } catch (error) {
            console.error("Error generating feedback summary:", error);
            res.status(500).json({ error: "Failed to generate feedback summary." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}