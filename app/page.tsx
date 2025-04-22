'use client';

import React from "react";
import Features from "../components/Features";
import {useRouter} from "next/navigation";
import "./page.css";

export default function Home() {
    const router = useRouter();

    const handleGetStartedClick = () => {
        router.push('/registration');
    };

    return (
        <main className="main-content">
            <h2 className="main-heading">AI-powered feedback generator for managers</h2>
            <p className="subheading">
                Easily compile substantial feedback for your team with the help of AI.
            </p>
            <div className="panel-container">
                <section className="feedback-panel">
                    <div className="panel-content">
                        <h2 className="panel-title">Simplify Performance Reviews with Confidence</h2>
                        <p className="panel-message">
                            Performance reviews don't have to be stressful. Our AI-powered tool simplifies the process, helping you provide meaningful feedback with ease. Make reviews a positive experience for everyone involved.
                        </p>
                        <button className="cta-button" onClick={handleGetStartedClick}>
                            Get Started Now
                        </button>
                    </div>
                </section>
                <Features/>
            </div>
        </main>
);
}