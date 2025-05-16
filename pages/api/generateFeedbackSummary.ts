import { NextApiRequest, NextApiResponse } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { startDate, endDate, teamMember } = req.body;

        if (!startDate || !endDate || !teamMember) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        try {
            // Fetch feedbacks for the given team member and date range
            const feedbackQuery = query(
                collection(db, "feedbacks"),
                where("teamMemberId", "==", teamMember),
                where("date", ">=", startDate),
                where("date", "<=", endDate)
            );
            const snapshot = await getDocs(feedbackQuery);

            const feedbacks = snapshot.docs.map((doc) => doc.data().text).join("\n");

            if (!feedbacks) {
                return res.status(404).json({ error: "No feedbacks found for the given criteria." });
            }

            // Generate summary using ChatGPT
            const response = await fetch("https://api.openai.com/v1/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: `Generate a feedback summary for the following feedbacks:\n${feedbacks}`,
                    max_tokens: 500,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json({ summary: data.choices[0].text });
            } else {
                res.status(500).json({ error: data.error.message });
            }
        } catch (error) {
            console.error("Error generating feedback summary:", error);
            res.status(500).json({ error: "Failed to generate feedback summary." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}