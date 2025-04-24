'use client';

import React, {useEffect, useState} from "react";
import {db} from "../../../firebase/firebaseConfig";
import {collection, getDocs} from "firebase/firestore";
import {useRouter} from "next/navigation";
import {FaCheckCircle} from "react-icons/fa";


interface Feedback {
    id: string;
    feedback: string;
    dateAdded: string;
    uid: string;
}

interface TeamMember {
    id: string;
    name: string;
    lastFeedbackDate?: string;
}

export default function FeedbackSummaryPanel() {
    //const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [outdatedFeedbackMembers, setOutdatedFeedbackMembers] = useState<TeamMember[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFeedbacksAndMembers = async () => {
            const teamSnapshot = await getDocs(collection(db, "teamMembers"));
            const members = teamSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as TeamMember[];

            const feedbackSnapshot = await getDocs(collection(db, "feedbacks"));
            const feedbacks = feedbackSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Feedback[];

            const twoWeeksAgo = new Date();
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

            const outdatedMembers = members.filter((member) => {
                const memberFeedbacks = feedbacks.filter((feedback) => feedback.uid === member.id);
                if (memberFeedbacks.length === 0) return true; // No feedbacks for this member
                const lastFeedbackDate = new Date(
                    memberFeedbacks.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())[0]
                        .dateAdded
                );
                return lastFeedbackDate < twoWeeksAgo;
            });

            //setTeamMembers(members);
            setOutdatedFeedbackMembers(outdatedMembers);
        };

        fetchFeedbacksAndMembers();
    }, []);

    return (
        <div>
            <h3>Feedback Summary</h3>
            {outdatedFeedbackMembers.length > 0 ? (
                <>
                    <p>
                        Please consider providing feedback for the following team members who have not received recent
                        feedback:
                    </p>
                    <ul>
                        {outdatedFeedbackMembers.map((member) => {
                            return (
                                <li key={member.id}>
                                    {member.name}
                                </li>
                            );
                        })}
                    </ul>
                    <p>
                        Go to <a href="#" onClick={() => router.push("/dashboard/my-team")}>
                        My Team
                    </a>{" page to provide feedback for them."}
                    </p>
                </>
            ) : (
                <>
                    <p>
                        <FaCheckCircle style={{color: "green", marginRight: "5px"}}/>
                        You’re all set! <br/>Recent feedback is available for all your team members.
                    </p>
                    <p>
                        You can go to{" "}
                        <a href="#" onClick={() => router.push("/dashboard/reports")}>
                            Feedback Summaries
                        </a>{" "}
                        page to generate feedback summaries.
                    </p>
                </>
            )}
        </div>
    );
}