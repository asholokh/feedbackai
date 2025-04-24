'use client';

import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./page.css";

interface Feedback {
    id: string;
    feedback: string;
    dateAdded: string;
    uid: string;
}

interface TeamMember {
    id: string;
    name: string;
}

export default function FeedbackHistory() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const feedbacksPerPage = 5;

    const fetchFeedbacksAndMembers = useCallback(async () => {
        const teamSnapshot = await getDocs(collection(db, "teamMembers"));
        const members = teamSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as TeamMember[];

        setTeamMembers(members);

        const feedbackSnapshot = await getDocs(collection(db, "feedbacks"));
        const feedbacksData = feedbackSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Feedback[];

        setFeedbacks(feedbacksData);
    }, []);

    useEffect(() => {
        fetchFeedbacksAndMembers();
    }, [fetchFeedbacksAndMembers]);

    const filteredFeedbacks = selectedMemberId
        ? feedbacks
            .filter((feedback) => feedback.uid === selectedMemberId)
            .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        : feedbacks.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

    const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
    const startIndex = (currentPage - 1) * feedbacksPerPage;
    const currentFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + feedbacksPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    return (
        <div className="feedback-history-container">
            <h2>Feedback History</h2>
            <div className="filter-container">
                <label htmlFor="team-member-select">Filter by Team Member:</label>
                <select
                    id="team-member-select"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                >
                    <option value="">All Team Members</option>
                    {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
            <ul className="feedback-list">
                {currentFeedbacks.map((feedback) => {
                    const member = teamMembers.find((member) => member.id === feedback.uid);
                    return (
                        <li key={feedback.id} className="feedback-item">
                            <div className="feedback-item-header">
                                <span>{member?.name || "Unknown"}</span>
                                <span>{new Date(feedback.dateAdded).toLocaleString()}</span>
                            </div>
                            <hr className="feedback-item-separator" />
                            <p className="feedback-item-text">{feedback.feedback}</p>
                        </li>
                    );
                })}
            </ul>
            <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}