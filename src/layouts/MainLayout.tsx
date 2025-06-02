import React from 'react';
import Header from "~/layouts/Header/Header";
import Footer from "~/layouts/Footer/Footer";

function MainLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="relative flex flex-col items-center min-h-screen w-full">
            <Header/>
            <div className="container relative pt-[120px] min-h-screen">
                {children}
            </div>
            <Footer/>
        </div>
    );
}

export default MainLayout;