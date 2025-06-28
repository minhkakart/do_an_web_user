'use client'
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {RootState} from '~/redux/store';
import {useSelector} from "react-redux";
import Loading from "~/components/common/Loading";
import {Paths} from "~/constants/config";

function AuthLayout({children}: { children: React.ReactNode }) {
    const router = useRouter();

    const [checking, setChecking] = useState(true);
    const userData = useSelector((state: RootState) => state.userData);
    const isLoggedIn = useSelector((state: RootState) => state.isLoggedIn);
    const isTokenValid = useSelector((state: RootState) => state.isTokenValid);
    const isCheckingToken = useSelector((state: RootState) => state.isCheckingToken);

    useEffect(() => {
        if (!isTokenValid && !isCheckingToken) {
            router.replace(Paths.Login);
            return;
        }
    }, [isTokenValid, isCheckingToken]);

    useEffect(() => {
        if (userData == null && isLoggedIn) {
            router.replace(Paths.Login);
        }
        setChecking(false);

    }, [userData, isLoggedIn]);

    if (checking) {
        return (
            <Loading/>
        );
    }

    return (
        <>
            {children}
        </>
    );
}

export default AuthLayout;