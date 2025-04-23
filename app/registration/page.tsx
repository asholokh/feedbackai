'use client';

import React, {useState} from "react";
import Image from "next/image";
import './page.css';
import {registerWithEmail, registerWithGoogle} from "../../firebase/auth";
import {useRouter} from "next/navigation";
import {sendEmailVerification, updateProfile} from "@firebase/auth";
import {signOut} from "firebase/auth";
import {auth} from "../../firebase/firebaseConfig";
import {FirebaseError} from "@firebase/app";

export default function Registration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

    const router = useRouter();

    const handlePopupButtonClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowPopup(false);
        router.push("/login");
    };

    const handleEmailRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const userCredentials = await registerWithEmail(email, password);
            console.log("User registered:", userCredentials);

            // Update the user's display name
            await updateProfile(userCredentials, { displayName: userName });
            console.log("User profile updated with name:", userName);

            await sendEmailVerification(userCredentials);
            console.log("Verification email sent: ", userCredentials);
            await signOut(auth);

            setShowPopup(true);
        } catch (error) {
            if (error instanceof FirebaseError) {
                // Handle specific Firebase error codes
                switch (error.code) {
                    case "auth/email-already-in-use":
                        setError("The email address is already in use by another account.");
                        break;
                    case "auth/invalid-email":
                        setError("The email address is not valid.");
                        break;
                    case "auth/weak-password":
                        setError("The password is too weak. Please use a stronger password.");
                        break;
                    default:
                        setError("An unexpected error occurred. Please try again.");
                }
            } else {
                console.error("An unknown error occurred:", error);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleGoogleRegistration = async () => {
        setError("");
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

                {error && <p className="error-text">{error}</p>}

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
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Name" required/>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>
                    <button type="submit" className="primary-button">Create Account</button>
                </form>

                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <p>Please verify your email to complete the registration process.</p>
                            <button onClick={handlePopupButtonClick} className="primary-button">Ok</button>
                        </div>
                    </div>
                )}

                <p className="footer-text">
                    Already have an account? <a href="/login">Log in</a>
                </p>
            </div>
        </div>
    );
}