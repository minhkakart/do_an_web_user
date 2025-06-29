import React from "react";
import MainLayout from "~/layouts/MainLayout";

function Layout(props: { children: React.ReactNode }) {
    return (
        <MainLayout showSearch={false}>
            {props.children}
        </MainLayout>
    );
}

export default Layout;