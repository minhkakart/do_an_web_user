import React from 'react';
import Header from "~/layouts/Header/Header";
import Footer from "../components/common/Footer/Footer";

function MainLayout({children, showSearch = true}: { children: React.ReactNode, showSearch?: boolean }) {
    return (
        <div className="relative flex flex-col min-h-screen w-full items-center bg-white">
            <Header/>
            <div className="container relative pt-[120px] flex flex-1 w-full">
                {children}
            </div>
            <Footer/>
        </div>
    );
}

export default MainLayout;