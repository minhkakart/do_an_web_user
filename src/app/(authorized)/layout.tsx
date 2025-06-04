import React from 'react';
import AuthLayout from "~/layouts/AuthLayout";

function Layout({children}: { children: React.ReactNode }) {
    return (
        <AuthLayout>
            {children}
        </AuthLayout>
    );
}

export default Layout;