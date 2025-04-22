import {FaChartBar, FaCog, FaHistory, FaUsers} from "react-icons/fa";
import React from "react";
import {signOut} from "firebase/auth";
import {auth} from "../../../firebase/firebaseConfig";
import {useRouter} from "next/navigation";
import './Menu.css';

interface MenuProps {
    onMenuClick: (menu: string) => void;
}

export default function Menu({ onMenuClick }: MenuProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login"); // Redirect to login page after logout
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li onClick={() => onMenuClick("my-team")}>
                        <FaUsers className="menu-icon"/>
                        My Team
                    </li>
                    <li onClick={() => onMenuClick("feedback-history")}>
                        <FaHistory className="menu-icon"/>
                        Feedback History
                    </li>
                    <li onClick={() => onMenuClick("reports")}>
                        <FaChartBar className="menu-icon"/>
                        Reports
                    </li>
                    <li onClick={() => onMenuClick("settings")}>
                        <FaCog className="menu-icon"/>
                        Settings
                    </li>
                </ul>
            </nav>
            <button onClick={handleLogout} className="logout-button">
                Log Out
            </button>
        </aside>
    );
}