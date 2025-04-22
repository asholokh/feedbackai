import React, { useState, useEffect } from "react";
import {addDoc, updateDoc, doc, collection} from "@firebase/firestore";
import { db } from "../../../../firebase/firebaseConfig";
import "./TeamMemberPopup.css";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    lastFeedbackDate: string;
    uid: string | null;
}

interface TeamMemberPopupProps {
    isOpen: boolean;
    editingMember: TeamMember | null;
    userUid: string | null;
    onClose: () => void;
    onUpdateTeamMembers: (updatedMembers: TeamMember[]) => void;
    teamMembers: TeamMember[];
}

export default function TeamMemberPopup({
                                            isOpen,
                                            editingMember,
                                            userUid,
                                            onClose,
                                            onUpdateTeamMembers,
                                            teamMembers,
                                        }: TeamMemberPopupProps) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [nameError, setNameError] = useState("");
    const [roleError, setRoleError] = useState("");

    useEffect(() => {
        if (editingMember) {
            setName(editingMember.name);
            setRole(editingMember.role);
        } else {
            setName("");
            setRole("");
        }
    }, [editingMember]);

    const handleSave = async () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError("Name is required.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!role.trim()) {
            setRoleError("Role is required.");
            isValid = false;
        } else {
            setRoleError("");
        }

        if (!isValid) return;

        if (editingMember) {
            // Update existing member
            try {
                const memberRef = doc(db, "teamMembers", editingMember.id);
                await updateDoc(memberRef, { name, role });

                const updatedMembers = teamMembers.map((member) =>
                    member.id === editingMember.id ? { ...member, name, role } : member
                );
                onUpdateTeamMembers(updatedMembers);
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        } else {
            // Add new member
            const newMember = {
                name,
                role,
                lastFeedbackDate: "n/a",
                uid: userUid,
            };

            try {
                const docRef = await addDoc(collection(db, "teamMembers"), newMember);
                const updatedMembers = [
                    ...teamMembers,
                    { id: docRef.id, ...newMember },
                ];
                onUpdateTeamMembers(updatedMembers);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }

        onClose();
    };

    const handleClose = () => {
        setName(""); // Clear the name input
        setRole(""); // Clear the role input
        setNameError(""); // Clear any error messages
        setRoleError("");
        onClose();
    };

    if (!isOpen) return null;

    const title = editingMember ? "Edit Team Member" : "Add New Team Member";

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{title}</h3>
                <div>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && <p className="error-message">{nameError}</p>}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                    {roleError && <p className="error-message">{roleError}</p>}
                </div>
                <button onClick={handleSave} className="save-button">
                    Save
                </button>
                <button onClick={handleClose} className="cancel-button">
                    Cancel
                </button>
            </div>
        </div>
    );
}