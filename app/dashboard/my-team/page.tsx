'use client';

import React, { useEffect, useState } from "react";
import { FaEdit, FaCommentDots, FaFileAlt } from "react-icons/fa";
import "./page.css";
import { addDoc, collection, getDocs, query, where, updateDoc, doc } from "@firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { auth } from "../../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    lastFeedbackDate: string;
    uid: string | null;
}

export default function MyTeam() {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("");
    const [nameError, setNameError] = useState("");
    const [roleError, setRoleError] = useState("");
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [userUid, setUserUid] = useState<string | null>(null);

    useEffect(() => {
        // Get the logged-in user's UID
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUid(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (userUid) {
            const fetchTeamMembers = async () => {
                const q = query(collection(db, "teamMembers"), where("uid", "==", userUid));
                const querySnapshot = await getDocs(q);
                const members = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as TeamMember[];
                setTeamMembers(members);
            };

            fetchTeamMembers();
        }
    }, [userUid]);

    const handleSaveMember = async () => {
        let isValid = true;

        if (!newMemberName.trim()) {
            setNameError("Name is required.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!newMemberRole.trim()) {
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
                await updateDoc(memberRef, {
                    name: newMemberName,
                    role: newMemberRole,
                });

                setTeamMembers((prev) =>
                    prev.map((member) =>
                        member.id === editingMember.id
                            ? { ...member, name: newMemberName, role: newMemberRole }
                            : member
                    )
                );
                setEditingMember(null);
            } catch (error) {
                console.error("Error updating document: ", error);
            }
        } else {
            // Add new member
            const newMember = {
                name: newMemberName,
                role: newMemberRole,
                lastFeedbackDate: "n/a",
                uid: userUid, // Associate with the logged-in user
            };

            try {
                const docRef = await addDoc(collection(db, "teamMembers"), newMember);
                setTeamMembers([...teamMembers, { id: docRef.id, ...newMember }]);
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }

        setIsModalOpen(false); // Close the modal
        setNewMemberName(""); // Reset input fields
        setNewMemberRole("");
    };

    const handleEditMember = (member: TeamMember) => {
        setEditingMember(member);
        setNewMemberName(member.name);
        setNewMemberRole(member.role);
        setIsModalOpen(true);
    };

    return (
        <div className="my-team-container">
            <h2>My Team</h2>
            <div className="button-container">
                <button
                    onClick={() => {
                        setEditingMember(null);
                        setNewMemberName("");
                        setNewMemberRole("");
                        setIsModalOpen(true);
                    }}
                    className="add-member-button"
                >
                    Add New Team Member
                </button>
            </div>
            <table className="team-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Last Feedback Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {teamMembers.map((member) => (
                    <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.role}</td>
                        <td>{member.lastFeedbackDate}</td>
                        <td>
                            <button
                                className="table-button"
                                onClick={() => handleEditMember(member)}
                            >
                                <FaEdit /> Edit
                            </button>
                            <button className="table-button">
                                <FaCommentDots /> Add Feedback
                            </button>
                            <button className="table-button">
                                <FaFileAlt /> Generate Report
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editingMember ? "Edit Team Member" : "Add New Team Member"}</h3>
                        <div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                            />
                            {nameError && <p className="error-message">{nameError}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Role"
                                value={newMemberRole}
                                onChange={(e) => setNewMemberRole(e.target.value)}
                            />
                            {roleError && <p className="error-message">{roleError}</p>}
                        </div>
                        <button onClick={handleSaveMember} className="save-button">
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditingMember(null);
                            }}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}