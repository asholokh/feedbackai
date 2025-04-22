import React, { useState } from "react";
import "./FeedbackPopup.css";

interface FeedbackPopupProps {
    isOpen: boolean;
    teamMemberName: string | null;
    onClose: () => void;
    onAddFeedback: (feedback: string) => void;
}

export default function FeedbackPopup({
                                          isOpen,
                                          teamMemberName,
                                          onClose,
                                          onAddFeedback,
                                      }: FeedbackPopupProps) {
    const [feedback, setFeedback] = useState("");

    const handleAdd = () => {
        onAddFeedback(feedback);
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
                <h3>Add Feedback for {teamMemberName}</h3>
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