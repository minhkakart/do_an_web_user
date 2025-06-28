import React from 'react';
import Header from "~/layouts/Header/Header";
import Footer from "../components/common/Footer/Footer";

function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col min-h-screen w-full items-center">
            <Header/>
            <div className="container relative pt-[120px] flex flex-1 w-full">
                {children}
            </div>
            <Footer/>
        </div>
    );
}

export default MainLayout;