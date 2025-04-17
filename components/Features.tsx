import React from 'react';
import Image from 'next/image';
import './Features.css';

export default function Features() {
    return (
        <section className="features">
            <div className="feature">
                <Image src="/assets/icon-main.png" alt="Collect Feedback" width={48} height={48} />
                <h3>Collect Feedback</h3>
                <p>Gather feedback snippets for each team member over time</p>
            </div>
            <div className="feature">
                <Image src="/assets/icon-generate-reports.png" alt="Generate Reports" width={48} height={48} />
                <h3>Generate Reports</h3>
                <p>Compile the feedback into detailed reports, either formal or informal</p>
            </div>
            <div className="feature">
                <Image src="/assets/icon-review-and-edit.png" alt="Review and Edit" width={48} height={48} />
                <h3>Review and Edit</h3>
                <p>Easily review the generated feedback and make any necessary edits</p>
            </div>
        </section>
    );
}