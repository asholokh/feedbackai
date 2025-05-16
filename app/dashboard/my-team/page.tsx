'use client';

import React, {useCallback, useEffect, useState} from "react";
import {addDoc, collection, deleteDoc, doc, getDocs, query, where} from "@firebase/firestore";
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
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
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

    const fetchTeamMembersAndFeedback = useCallback(async () => {
        // Fetch team members
        const teamQuery = query(collection(db, "teamMembers"), where("uid", "==", userUid));
        const teamSnapshot = await getDocs(teamQuery);
        const members = teamSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as TeamMember[];

        // Extract member IDs
        const memberIds = members.map((member) => member.id);

        // Skip feedback query if memberIds is empty
        if (memberIds.length === 0) {
            setTeamMembers(members);
            return;
        }

        // Fetch feedbacks only for the given team members
        const feedbackQuery = query(
            collection(db, "feedbacks"),
            where("uid", "in", memberIds) // Filter feedbacks by member IDs
        );
        const feedbackSnapshot = await getDocs(feedbackQuery);
        const feedbacks = feedbackSnapshot.docs.map((doc) => doc.data());

        // Map latest feedback date to each team member
        const updatedMembers = members.map((member) => {
            const memberFeedbacks = feedbacks.filter((feedback) => feedback.uid === member.id);
            const latestFeedback = memberFeedbacks.reduce((latest, current) => {
                const currentDate = new Date(current.dateAdded);
                return currentDate > new Date(latest.dateAdded) ? current : latest;
            }, { dateAdded: null });

            return {
                ...member,
                lastFeedbackDate: latestFeedback.dateAdded,
            };
        });

        setTeamMembers(updatedMembers);
    }, [userUid]);

    useEffect(() => {
        fetchTeamMembersAndFeedback();
    }, [fetchTeamMembersAndFeedback]);

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
        setSelectedMember(member);
        setIsFeedbackPopupOpen(true);
    };

    const handleDeleteMember = async (memberId: string) => {
        if (!window.confirm("Are you sure you want to delete this team member?")) {
            return;
        }

        try {
            // Delete the team member from Firestore
            await deleteDoc(doc(db, "teamMembers", memberId));

            // Update the local state
            setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));

            console.log("Team member deleted successfully");
        } catch (error) {
            console.error("Error deleting team member:", error);
        }
    };

    const handleFeedbackSubmit = async (member: TeamMember | null, feedback: string) => {
        console.log(`Feedback for ${member?.name}:`, feedback);

        if (!member) {
            console.error("No team member selected for feedback");
            return;
        }

        try {
            // Save feedback to Firestore
            await addDoc(collection(db, "feedbacks"), {
                uid: member.id,
                feedback: feedback,
                dateAdded: new Date().toISOString(), // Save the current date
            });

            console.log("Feedback added successfully");

            if (userUid) {
                await fetchTeamMembersAndFeedback();
            }
        } catch (error) {
            console.error("Error adding feedback:", error);
        }
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
                onDeleteMember={handleDeleteMember}
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
                teamMember={selectedMember}
                onClose={() => setIsFeedbackPopupOpen(false)}
                onAddFeedback={handleFeedbackSubmit}
            />
        </div>
    );
}