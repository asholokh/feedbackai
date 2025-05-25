import React, { useState } from "react";

import "./SimplifiedFeedbackPanel.css";

export default function SimplifiedFeedbackPanel() {
    const [showPopup, setShowPopup] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [generatedText, setGeneratedText] = useState("");

    const handleAdd = async () => {
        if (!feedback.trim()) {
            setGeneratedText("Please provide some feedback notes.");
            return;
        }

        try {
            const response = await fetch("/api/generateFeedbackSummary", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({feedbacks: [ feedback ] }),
            });

            const data = await response.json();

            if (response.ok) {
                setGeneratedText(data.result);
            } else {
                setGeneratedText(data.error || "An error occurred while generating feedback.");
            }
        } catch (error) {
            console.error("Error:", error);
            setGeneratedText("An error occurred while generating feedback.");
        }
    };

    const handleClose = () => {
        setFeedback(""); // Clear the input when closing the popup
        setGeneratedText("")
        setShowPopup(false);
    };

    return (
        <div>
            <h3>Simplified feedback tool</h3>
            <p>
                If you&apos;`re not ready to start building detailed feedback history for your team, try our simplified
                feedback summary generation tool.
            </p>
            <p>
                Add quick feedback notes and instantly view the resulting summary!
            </p>
            <button onClick={() => setShowPopup(true)} className="open-popup-button">
                Try Simplified Tool
            </button>

            {showPopup && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Generate feedback summary</h3>
                        <div className="popup-container">
                            <div className="input-section">
                                <textarea
                                    className="editor-input"
                                    placeholder="Enter feedback notes in a free format..."
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                                <div className="button-container">
                                    <button onClick={handleAdd} className="generate-button">
                                        Generate
                                    </button>
                                    <button onClick={handleClose} className="cancel-button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            <div className="output-section">
                                <p>{generatedText || "No feedback generated yet."}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}