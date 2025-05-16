import React from "react";
import { FaEdit, FaCommentDots, FaFileAlt } from "react-icons/fa";
import {TeamMember} from "../types/TeamMember";
import "./TeamTable.css";
import {formatDistanceToNow} from "date-fns";

interface TeamTableProps {
    teamMembers: TeamMember[];
    onEditMember: (member: TeamMember) => void;
    onAddFeedback: (member: TeamMember) => void;
    onDeleteMember: (memberId: string) => void;
}

export default function TeamTable({ teamMembers, onEditMember, onAddFeedback, onDeleteMember }: TeamTableProps) {
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
                    <td>{!isNaN(new Date(member.lastFeedbackDate).getTime()) && member.lastFeedbackDate !== null ? formatDistanceToNow(member.lastFeedbackDate, { addSuffix: true }) : "No feedback yet"}</td>
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
                        <button className="table-button"
                                onClick={() => onDeleteMember(member.id)}
                        >
                            <FaFileAlt /> Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}