'use client';

import './page.css';
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {onAuthStateChanged, signOut, User} from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser); // Set the authenticated user
            } else {
                router.push("/login"); // Redirect to login if not authenticated
            }
        });

        return () => unsubscribe(); // Cleanup the listener on unmount
    }, [router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login"); // Redirect to login page after logout
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    if (!user) {
        return null; // Optionally, show a loading spinner here
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome to your Dashboard</h1>
            <p>This is your main application area.</p>
            <button onClick={handleLogout} className="logout-button">
                Log Out
            </button>
        </div>
    );
}