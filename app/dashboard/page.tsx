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
            <div className="panel panel-3">Panel 3</div>
            <div className="panel panel-4">Panel 4</div>
        </div>
    );
}