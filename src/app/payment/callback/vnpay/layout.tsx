import React from "react";
import MainLayout from "~/layouts/MainLayout";
import AuthLayout from "~/layouts/AuthLayout";

function Layout(props: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {/*<MainLayout>*/}
                {props.children}
            {/*</MainLayout>*/}
        </AuthLayout>
    );
}

export default Layout;