'use client';

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { auth } from "../../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import TeamTable from "./components/TeamTable";
import TeamMemberPopup from "./components/TeamMemberPopup";
import { TeamMember } from "./types/TeamMember";
import FeedbackPopup from "./components/FeedbackPopup";
import "./page.css";

export default function MyTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false);
    const [selectedMemberName, setSelectedMemberName] = useState<string | null>(null);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [userUid, setUserUid] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userUid) {
            const fetchTeamMembers = async () => {
                const q = query(collection(db, "teamMembers"), where("uid", "==", userUid));
                const querySnapshot = await getDocs(q);
                const members = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as TeamMember[];
                setTeamMembers(members);
            };

            fetchTeamMembers();
        }
    }, [userUid]);

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(null); // Reset editingMember to trigger useEffect
        setTimeout(() => {
            setEditingMember(member);
            setIsPopupOpen(true);
        }, 1); // Delay to ensure state updates
    };

    const handleAddMember = () => {
        setEditingMember(null);
        setIsPopupOpen(true);
    };

    const handleAddFeedback = (member: TeamMember) => {
        setSelectedMemberName(member.name);
        setIsFeedbackPopupOpen(true);
    };

    const handleFeedbackSubmit = (feedback: string) => {
        console.log(`Feedback for ${selectedMemberName}:`, feedback);
        // Add logic to save feedback
    };

    return (
        <div className="my-team-container">
            <h2>My Team</h2>
            <div className="button-container">
                <button onClick={handleAddMember} className="add-member-button">
                    Add New Team Member
                </button>
            </div>
            <TeamTable
                teamMembers={teamMembers}
                onEditMember={handleEditMember}
                onAddFeedback={handleAddFeedback}
            />
            <TeamMemberPopup
                isOpen={isPopupOpen}
                editingMember={editingMember}
                userUid={userUid}
                onClose={() => setIsPopupOpen(false)}
                onUpdateTeamMembers={setTeamMembers}
                teamMembers={teamMembers}
            />
            <FeedbackPopup
                isOpen={isFeedbackPopupOpen}
                teamMemberName={selectedMemberName}
                onClose={() => setIsFeedbackPopupOpen(false)}
                onAddFeedback={handleFeedbackSubmit}
            />
        </div>
    );
}