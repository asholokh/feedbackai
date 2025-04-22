import React, { useState } from "react";
import { FaChartBar, FaCog, FaHistory, FaUsers } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import "./Menu.css";

interface MenuProps {
    onMenuClick: (menu: string) => void;
}

interface MenuItemProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, label, icon, isActive, onClick }) => (
    <li
        key={id}
        className={isActive ? "active" : ""}
        onClick={onClick}
    >
        {icon}
        {label}
    </li>
);

export default function Menu({ onMenuClick }: MenuProps) {
    const router = useRouter();
    const [activeMenu, setActiveMenu] = useState("dashboard");

    const menuItems = [
        { id: "my-team", label: "My Team", icon: <FaUsers className="menu-icon" /> },
        { id: "feedback-history", label: "Feedback History", icon: <FaHistory className="menu-icon" /> },
        { id: "reports", label: "Reports", icon: <FaChartBar className="menu-icon" /> },
        { id: "settings", label: "Settings", icon: <FaCog className="menu-icon" /> },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    {menuItems.map((item) => (
                        <MenuItem
                            key={item.id}
                            id={item.id}
                            label={item.label}
                            icon={item.icon}
                            isActive={activeMenu === item.id}
                            onClick={() => {
                                setActiveMenu(item.id);
                                onMenuClick(item.id);
                            }}
                        />
                    ))}
                </ul>
            </nav>
            <button onClick={handleLogout} className="logout-button">
                Log Out
            </button>
        </aside>
    );
}