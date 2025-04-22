'use client'

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import './Header.css';
import Link from "next/link";
import {useRouter} from "next/navigation";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "../firebase/firebaseConfig";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Set login state based on user presence
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await signOut(auth); // Firebase logout
            router.push("/login"); // Redirect to login page
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <header className="header">
            <Link className="logo" href="/">
                <Image src="/assets/icon-main.png" alt="FeedbackAi logo" width={32} height={32} />
                <h1>FeedbackAi</h1>
            </Link>
            {isLoggedIn ? (
                <a href="/login" onClick={handleLogout} className="no-underline">Logout</a>
            ) : (
                <Link href="/login" className="no-underline">Login</Link>
            )}
        </header>
    );
}