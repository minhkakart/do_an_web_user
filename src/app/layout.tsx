import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../styles/_globals.scss";
import React, {use} from "react";

import 'moment/locale/vi';

import 'react-toastify/dist/ReactToastify.css';
import 'tippy.js/dist/tippy.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-video.css';
import 'lightgallery/css/lg-share.css';
import AppProvider from "~/contexts/AppProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Enjoy Your Drinks",
    description: "A place to enjoy your favorite drinks",
};

type RootLayoutProps = Readonly<{
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}>

export default function RootLayout({children, params}: RootLayoutProps) {
    const {lang} = use(params);
    return (
        <html lang={lang}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProvider pageProps={params}>
            {children}
        </AppProvider>
        </body>
        </html>
    );
}
