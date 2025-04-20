import React from 'react';
import Image from 'next/image';
import './Header.css';
import Link from "next/link";

export default function Header() {
    return (
        <header className="header">
            <Link className="logo" href="/">
                <Image src="/assets/icon-main.png" alt="FeedbackAi logo" width={32} height={32} />
                <h1>FeedbackAi</h1>
            </Link>
            <a className="login-link" href="/login">
                Log in
            </a>
        </header>
    );
}