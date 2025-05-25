'use client';

import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./page.css";
import {getAuth} from "firebase/auth";

interface TeamMember {
    id: string;
    name: string;
}

interface Feedback {
    id: string;
    feedback: string;
    dateAdded: string;
    uid: string;
}

export default function FeedbackSummary() {
    const [fromDate, setFromDate] = useState<string>("");
    const [toDate, setToDate] = useState<string>("");
    const [selectedMemberId, setSelectedMemberId] = useState<string>("");
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
    const [summaryText, setSummaryText] = useState<string>("");
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    // Get current date in YYYY-MM-DD format for max date validation
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchTeamMembersAndFeedbacks = async () => {
            // Fetch team members
            const teamSnapshot = await getDocs(collection(db, "teamMembers"));
            const members = teamSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as TeamMember[];
            setTeamMembers(members);

            // Fetch all feedbacks
            const feedbackSnapshot = await getDocs(collection(db, "feedbacks"));
            const feedbacksData = feedbackSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Feedback[];
            setFeedbacks(feedbacksData);
        };

        fetchTeamMembersAndFeedbacks();
    }, []);

    const handleGenerateSummary = async () => {
        // Validate dates and selected member before proceeding
        if (!fromDate || !toDate) {
            alert("Please select both from and to dates");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            alert("From date cannot be after to date");
            return;
        }

        // Filter feedbacks based on selected criteria
        const filtered = feedbacks.filter(feedback => {
            const feedbackDate = new Date(feedback.dateAdded);
            const from = new Date(fromDate);
            const to = new Date(toDate);

            // Set hours to 0 for proper date comparison
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);

            // Check if within date range
            const isInDateRange = feedbackDate >= from && feedbackDate <= to;

            // Check if matches selected team member (if any)
            const matchesMember = selectedMemberId ? feedback.uid === selectedMemberId : true;

            return isInDateRange && matchesMember;
        });

        setFilteredFeedbacks(filtered);
        const feedBacksArray = filtered.map((feedback) => { return "When: " + feedback.dateAdded + "." + feedback.feedback});

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            // Make a call to the backend API
            if (user) {
                const token = await user.getIdToken();
                const response = await fetch("/api/generateFeedbackSummary", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        feedbacks: feedBacksArray
                    }),
                });
                if (!response.ok) {
                    throw new Error("Failed to generate feedback summary");
                }

                const data = await response.json();

                // Update the summaryText with the generated summary
                setSummaryText(data.result.feedbackSummary || "No summary generated.");
            } else {
                console.error("User is not authenticated.");
            }
        } catch (error) {
            console.error("Error generating feedback summary:", error);
            alert("An error occurred while generating the feedback summary.");
        }
    };

    return (
        <div className="feedback-summary-container">
            <h2>Feedback Summary</h2>

            <div className="summary-controls">
                <div className="date-picker">
                    <label htmlFor="from-date">From:</label>
                    <input
                        id="from-date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        max={today}
                    />
                </div>

                <div className="date-picker">
                    <label htmlFor="to-date">To:</label>
                    <input
                        id="to-date"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        max={today}
                    />
                </div>

                <div className="member-selector">
                    <label htmlFor="team-member-select">Team Member:</label>
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

                <button
                    className="generate-button"
                    onClick={handleGenerateSummary}
                >
                    Generate Feedback Summary
                </button>
            </div>

            <div className="summary-content">
                <div className="feedbacks-panel">
                    <h3>Feedbacks</h3>
                    {filteredFeedbacks.length === 0 ? (
                        <p className="no-data">No feedbacks found for the selected criteria.</p>
                    ) : (
                        <ul className="feedback-list">
                            {filteredFeedbacks.map((feedback) => {
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
                    )}
                </div>

                <div className="summary-panel">
                    <h3>Summary Analysis</h3>
                    <div className="textarea-container">
                        <div className="copy-button-container">
                            <button
                                className="copy-button"
                                onClick={() => navigator.clipboard.writeText(summaryText)}
                                title="Copy to Clipboard"
                            >
                                📋
                            </button>
                            <span className="copy-button-tooltip">Copy to Clipboard</span>
                        </div>
                        <textarea
                            className="summary-textarea"
                            value={summaryText}
                            onChange={(e) => setSummaryText(e.target.value)}
                            placeholder="Summary will be generated when you click the button above..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}