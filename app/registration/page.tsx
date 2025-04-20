'use client';

import React, {useState} from "react";
import Image from "next/image";
import './page.css';
import {registerWithEmail, registerWithGoogle} from "../../firebase/auth";
import {useRouter} from "next/navigation";

export default function Registration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleEmailRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerWithEmail(email, password);
            router.push("/dashboard"); // Redirect to dashboard after successful registration
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const handleGoogleRegistration = async () => {
        try {
            await registerWithGoogle();
            router.push("/dashboard"); // Redirect to dashboard after successful Google registration
        } catch (error) {
            console.error("Google registration failed:", error);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1>
                    Create your <br/> FeedbackAi account
                </h1>
                <p className="subtext">Start generating feedback with just a few clicks.</p>

                <button className="google-button" onClick={handleGoogleRegistration}>
                    <Image
                        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                        alt="Google icon" width={32} height={32} layout="intrinsic"/>
                    Register with Google
                </button>

                <div className="divider">
                    <span>or</span>
                </div>

                <form onSubmit={handleEmailRegistration}>
                    <input type="text" placeholder="Name" required/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
                    <button type="submit" className="primary-button">Create Account</button>
                </form>

                <p className="footer-text">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}