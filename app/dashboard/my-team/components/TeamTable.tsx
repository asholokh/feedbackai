import React from "react";
import { FaEdit, FaCommentDots, FaFileAlt } from "react-icons/fa";
import {TeamMember} from "../types/TeamMember";
import "./TeamTable.css";

interface TeamTableProps {
    teamMembers: TeamMember[];
    onEditMember: (member: TeamMember) => void;
    onAddFeedback: (member: TeamMember) => void;
}

export default function TeamTable({ teamMembers, onEditMember, onAddFeedback }: TeamTableProps) {
    return (
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
                            onClick={() => onEditMember(member)}
                        >
                            <FaEdit /> Edit
                        </button>
                        <button className="table-button"
                            onClick={() => onAddFeedback(member)}
                        >
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
    );
}