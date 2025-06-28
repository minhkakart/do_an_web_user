import React from "react";
import MainLayout from "~/layouts/MainLayout";

function Layout(props: { children: React.ReactNode }) {
    return (
        <MainLayout>
            {props.children}
        </MainLayout>
    );
}

export default Layout;