'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import Menu from "./components/Menu";
import './page.css';

export default function Layout({ children }: { children: React.ReactNode }) {
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

    if (!user) {
        return null; // Optionally, show a loading spinner here
    }

    return (
        <div className="dashboard-container">
            <Menu onMenuClick={(menu) => router.push(`/dashboard/${menu}`)} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}