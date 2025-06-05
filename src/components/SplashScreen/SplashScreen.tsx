'use client';

import {Fragment, useEffect, useState} from 'react';
import {RootState, store} from '~/redux/store';

import Lottie from 'react-lottie';

import {PropsSplashScreen} from './interfaces';
import clsx from 'clsx';
import styles from './SplashScreen.module.scss';

import * as loading from '../../../public/static/anim/loadingScreen.json';
import {getItemStorage} from "~/commons/funcs/localStorage";
import {IToken, IUserData} from "~/commons/interfaces";
import {KEY_STORAGE_TOKEN} from "~/constants/config";
import {setIsCheckingToken, setIsLoggedIn, setToken, setUserData} from "~/redux/appReducer";
import {useSelector} from "react-redux";
import {apiRequest} from "~/services";
import authService from "~/services/apis/authService";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

function SplashScreen({children}: PropsSplashScreen) {
    const [loadingToken, setLoadingToken] = useState<Boolean>(true)

    const appToken = useSelector((state: RootState) => state.token);

    useEffect(() => {
        if (loadingToken){
            return () => {};
        }
        (async () => {
            if (appToken !== null) {
                const res: IUserData = await apiRequest({
                    api: async () => authService.checkToken()
                });
                if (!!res) {
                    store.dispatch(setUserData(res))
                    store.dispatch(setIsLoggedIn(true))
                }
            }
            setLoadingToken(false);
            setLoadingToken(false);
        })();
    }, [appToken, loadingToken]);

    useEffect(() => {
        store.dispatch(setIsCheckingToken(true));
        const token = getItemStorage<IToken>(KEY_STORAGE_TOKEN);
        if (token) {
            store.dispatch(setToken(token));
            setLoadingToken(false);
            return;
        }
        store.dispatch(setIsCheckingToken(false));
        setLoadingToken(false);
    }, [])

    return (loadingToken) ?
        <Fragment>
            <div className={clsx(styles.container, styles.close)}>
                <div className={styles.logo}>
                    <Lottie options={defaultOptions}/>
                </div>
            </div>
        </Fragment> :
        children
}

export default SplashScreen;
