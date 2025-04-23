'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import './page.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear any previous errors
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);

            if (userCredentials.user.emailVerified) {
                router.push("/dashboard"); // Redirect to dashboard on successful login
            } else {
                setError("User email is not yet verified");
            }
        } catch {
            setError("Invalid email or password. Please try again.");
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/dashboard"); // Redirect to dashboard on successful login
        } catch {
            setError("Failed to log in with Google. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1>Log in to FeedbackAi</h1>
                <p className="subtext">Access your account to continue.</p>

                {error && <p className="error-text">{error}</p>}

                <button className="google-button" onClick={handleGoogleLogin}>
                    <Image
                        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                        alt="Google icon"
                        width={32}
                        height={32}
                    />
                    Log in with Google
                </button>

                <div className="divider">
                    <span>or</span>
                </div>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit" className="primary-button">Log In</button>
                </form>

                <p className="footer-text">
                    Don&apos;t have an account? <a href="/registration">Sign up</a>
                </p>
            </div>
        </div>
    );
}