'use client';

import './page.css';
import React from "react";
import FeedbackSummaryPanel from "./panels/FeedbackSummaryPanel";
import SimplifiedFeedbackPanel from "./panels/SimplifiedFeedbackPanel";

export default function Dashboard() {
    return (
        <div className="panels-container">
            <div className="panel panel-1">
                <FeedbackSummaryPanel />
            </div>
            <div className="panel panel-2">
                <SimplifiedFeedbackPanel />
            </div>
        </div>
    );
}