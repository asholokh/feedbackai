import React, { useState } from "react";
import "./FeedbackPopup.css";
import {TeamMember} from "../types/TeamMember";

interface FeedbackPopupProps {
    isOpen: boolean;
    teamMember: TeamMember | null;
    onClose: () => void;
    onAddFeedback: (member: TeamMember | null, feedback: string) => void;
}

export default function FeedbackPopup({
                                          isOpen,
                                          teamMember,
                                          onClose,
                                          onAddFeedback,
                                      }: FeedbackPopupProps) {
    const [feedback, setFeedback] = useState("");

    const handleAdd = async () => {
        onAddFeedback(teamMember, feedback);
        setFeedback("");
        onClose();
    };

    const handleClose = () => {
        setFeedback(""); // Clear the input when closing the popup
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Add Feedback for {teamMember?.name}</h3>
                <textarea
                    className="editor-input"
                    placeholder="Enter feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                />
                <div className="button-container">
                    <button onClick={handleAdd} className="save-button">
                        Add
                    </button>
                    <button onClick={handleClose} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}