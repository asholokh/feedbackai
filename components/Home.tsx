import Features from "./Features";
import React from "react";
import {useRouter} from "next/navigation";
import './Home.css';

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
            <button onClick={handleGetStartedClick} className="cta-button">
                Get Started
            </button>
            <Features/>
        </main>
    );
}
