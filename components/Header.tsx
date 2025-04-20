import React from 'react';
import Image from 'next/image';
import './Header.css';

export default function Header() {
    return (
        <header className="header">
            <a className="logo" href="/">
                <Image src="/assets/icon-main.png" alt="FeedbackAi logo" width={32} height={32} />
                <h1>FeedbackAi</h1>
            </a>
            <a className="login-link" href="/login">
                Log in
            </a>
        </header>
    );
}