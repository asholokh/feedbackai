import React from 'react';
import Image from 'next/image';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <Image src="/assets/icon-main.png" alt="FeedbackAi logo" width={32} height={32} />
                <h1>FeedbackAi</h1>
            </div>
            <a className="login-link" href="#">
                Log in
            </a>
        </header>
    );
}