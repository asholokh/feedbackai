import type {Metadata} from "next";
import "./globals.css";
import Head from "next/head";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
    title: "FeedbackAi - AI-powered feedback generator for managers",
    description: "Easily compile substantial feedback for your team with the help of AI.",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <Head>
            <title>FeedbackAi</title>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </Head>
        <body>
        <Header/>
        {children}
        <Footer/>
        </body>
        </html>
    );
}
