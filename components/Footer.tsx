import React from 'react';
import {FaTwitter, FaLinkedin, FaFacebook, FaTelegram} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">
                    <h2>FeedbackAi</h2>
                </div>
                <nav className="footer-nav">
                    <a href="/about">About</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/contact">Contact</a>
                </nav>
                <div className="footer-social">
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <FaTwitter/>
                    </a>
                    <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                        <FaTelegram/>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <FaLinkedin/>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook/>
                    </a>
                </div>
                <p className="footer-copyright">
                    &copy; {new Date().getFullYear()} FeedbackAi. All rights reserved.
                </p>
            </div>
        </footer>
    );
}